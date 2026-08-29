# Git hooks versionados

`git` no versiona `.git/hooks/` por diseño (es local a cada clon). Esta
carpeta es la solución estándar: hooks reales, versionados junto al código,
activados apuntando `core.hooksPath` acá.

## Activar (una sola vez por clon)

```bash
git config core.hooksPath scripts/git-hooks
```

Ya está configurado en el workspace oficial actual. Si clonás el repo de
nuevo (otra máquina, otro checkout), correr ese comando una vez.

## Qué hace hoy

- **`pre-commit`** — corre `scripts/pre-commit-checks.py` antes de cada
  commit: barrido de archivos pesados (>50MB), patrones de secretos comunes,
  y los identificadores de PII ya conocidos de `D-093` fuera de los 3
  documentos autorizados por `governance/PII_POLICY.md`. No bloquea de forma
  irreversible — si es un falso positivo ya revisado, `git commit --no-verify`
  lo saltea.

## Qué NO hace (todavía)

No reemplaza el barrido manual completo que pide `CLAUDE.md` (leer el
contexto de cada coincidencia, distinguir PII real de una calle/empresa) ni
un scanner de secretos real por entropía (ver R-D4, `gitleaks`, si se
instala). Es una red de seguridad rápida, no el proceso completo.
