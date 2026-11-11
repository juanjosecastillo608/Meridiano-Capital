import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verificarCredenciales, firmarSesion, COOKIE_SESION, OPCIONES_COOKIE } from "@/server/auth";

async function ingresar(form: FormData) {
  "use server";
  const id = await verificarCredenciales(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
  if (!id) redirect("/login?error=1");
  (await cookies()).set(COOKIE_SESION, await firmarSesion(id), OPCIONES_COOKIE);
  redirect("/");
}

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-crema px-4">
      <form action={ingresar} className="w-full max-w-sm rounded-lg border border-linea bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/meridiano-isotipo.svg" alt="" className="h-10 w-10" />
          <div>
            <div className="font-serif text-lg font-semibold leading-tight">Meridiano Capital</div>
            <div className="text-xs uppercase tracking-[0.14em] text-gris">Property Management</div>
          </div>
        </div>
        {error && <div className="mb-4 rounded border border-error-borde bg-[#f6e3de] px-3 py-2 text-sm text-tierra">Credenciales inválidas.</div>}
        <label className="campo mb-3">Email<input name="email" type="email" required autoComplete="username" /></label>
        <label className="campo mb-5">Contraseña<input name="password" type="password" required autoComplete="current-password" /></label>
        <button className="btn w-full justify-center">Ingresar</button>
      </form>
    </main>
  );
}
