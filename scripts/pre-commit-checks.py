#!/usr/bin/env python3
"""
Barrido de PII/secretos/archivos pesados sobre lo staged para commit.

Implementa, en un solo script versionado, la disciplina que CLAUDE.md pide
correr a mano antes de cualquier commit (sección "Protocolo de PII y
seguridad") -- Fase 7, R-D3. No reemplaza el criterio humano de "leer el
contexto de cada coincidencia" (D-093): esto es un primer filtro rapido,
no un veredicto final. Si encuentra algo, imprime la coincidencia y deja
que la persona (o la sesion de Claude Code) decida.

Uso (normalmente invocado por el hook, no a mano):
    python scripts/pre-commit-checks.py

Sale con status != 0 si encuentra algo que bloquear -- el hook de git
entonces aborta el commit. Para forzar un commit a pesar de un hallazgo
que ya se revisó y es un falso positivo conocido, usar `git commit --no-verify`
(nunca automatizar ese salto, es una decisión humana explícita).
"""

import re
import subprocess
import sys

MAX_BYTES = 50 * 1024 * 1024  # 50MB, mismo umbral que CLAUDE.md/D-093 (Fase 6/7)

# Patrones de secretos -- no exhaustivo, ver R-D4 (gitleaks) para cobertura real.
SECRET_PATTERNS = [
    (r"AKIA[0-9A-Z]{16}", "posible AWS Access Key"),
    (r"ghp_[A-Za-z0-9]{30,}", "posible GitHub token"),
    (r"xox[baprs]-[0-9A-Za-z-]{10,}", "posible Slack token"),
    (r"AIza[0-9A-Za-z_-]{35}", "posible Google API key"),
    (r"sk-[A-Za-z0-9]{20,}", "posible OpenAI/Stripe secret key"),
    (r"sk_live_[0-9a-zA-Z]{20,}", "posible Stripe live key"),
    (r"-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----", "bloque de clave privada"),
    (r"eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}", "posible JWT"),
]

# PII conocida de casos ya cerrados -- ver governance/PII_POLICY.md. Esta
# lista NO es la unica fuente de verdad (cada caso nuevo trae la suya
# propia); sirve como red de seguridad para que estos datos puntuales,
# ya identificados como sensibles en D-093, nunca vuelvan a aparecer fuera
# de los 3 documentos autorizados.
KNOWN_PII_PATTERNS = [
    r"9228455", r"9\.228\.455",
    r"9381885", r"9\.381\.885",
]
AUTHORIZED_PII_FILES = {
    "contracts/cases/UON-001/facts/FACT_REGISTER.md",
    "contracts/cases/UON-001/evidence/CASE_FACTS.md",
    "contracts/cases/UON-001/UON-001_DISCOVERY_REPORT.md",
}

# Archivos que contienen los patrones a proposito, como texto de referencia
# para el propio detector (no PII real) -- mismo caso que el ejemplo
# documental de CLAUDE.md ("-----BEGIN...PRIVATE KEY-----").
SELF_EXEMPT_FILES = {
    "scripts/pre-commit-checks.py",
}


def staged_files():
    out = subprocess.run(
        ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"],
        capture_output=True, text=True, check=True,
    )
    return [f for f in out.stdout.splitlines() if f]


def staged_content(path):
    out = subprocess.run(["git", "show", f":{path}"], capture_output=True, check=True)
    return out.stdout


def check_size(path, data, problems):
    if len(data) > MAX_BYTES:
        problems.append(
            f"[ARCHIVO PESADO] {path}: {len(data)/1048576:.1f}MB supera el umbral de 50MB "
            f"(CLAUDE.md) -- confirmar que realmente necesita versionarse, considerar Git LFS."
        )


def check_secrets(path, text, problems):
    for pattern, label in SECRET_PATTERNS:
        if re.search(pattern, text):
            problems.append(f"[SECRETO?] {path}: coincide con patrón de {label} -- revisar antes de commitear.")


def check_known_pii(path, text, problems):
    if path in AUTHORIZED_PII_FILES or path in SELF_EXEMPT_FILES:
        return  # PII autorizada por PII_POLICY.md, o texto de referencia del propio detector
    for pattern in KNOWN_PII_PATTERNS:
        if re.search(pattern, text):
            problems.append(
                f"[PII CONOCIDA] {path}: coincide con un identificador ya marcado como PII "
                f"en D-093 -- este archivo no está en la lista de documentos autorizados "
                f"(governance/PII_POLICY.md). Revisar antes de commitear."
            )


def main():
    problems = []
    for path in staged_files():
        try:
            data = staged_content(path)
        except subprocess.CalledProcessError:
            continue  # archivo borrado/renombrado sin contenido nuevo que revisar
        check_size(path, data, problems)
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            continue  # binario -- ya cubierto por check_size, no se busca texto adentro
        check_secrets(path, text, problems)
        check_known_pii(path, text, problems)

    if problems:
        print("pre-commit-checks.py encontró lo siguiente (no bloquea automáticamente,")
        print("pero revisar antes de seguir -- ver CLAUDE.md, sección Protocolo de PII y seguridad):")
        for p in problems:
            print(f"  - {p}")
        print()
        print("Si son falsos positivos ya revisados, commitear con --no-verify.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
