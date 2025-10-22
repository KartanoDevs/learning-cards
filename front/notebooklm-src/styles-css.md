# styles.css

> Generado desde: `C:\Users\Kartano\Desktop\Programación\AlejandroGit\learning-cards\front\src/styles.css`


## File: `styles.css`

```css

/* ===== Paleta (azules / negro / blanco) ===== */
:root {
  /* Marca */
  --brand-900: #0B1220; /* casi negro azulado */
  --brand-800: #0F172A; /* slate oscuro */
  --brand-700: #1E293B; /* slate medio */
  --brand-600: #1D4ED8; /* azul intenso */
  --brand-500: #2563EB; /* azul principal */
  --brand-400: #60A5FA; /* azul claro para hovers */
  --brand-300: #93C5FD; /* azul muy claro */

  /* Superficies y texto */
  --surface-0: #FFFFFF; /* blanco */
  --surface-1: #F7FAFC; /* gris casi blanco */
  --surface-2: #EEF2F7; /* gris claro para separar secciones */
  --text-900: #0B1220;
  --text-700: #334155;

  /* Accesibilidad (borde/foco) */
  --focus: #60A5FA;

  /* Gradientes / decor */
  --grad-header: linear-gradient(135deg, var(--brand-900), var(--brand-800) 60%, var(--brand-700));
  --grad-cta: linear-gradient(135deg, var(--brand-600), var(--brand-500));
}

/* ===== Modo oscuro opcional (actívalo con <html data-theme="dark">) ===== */
:root[data-theme="dark"] {
  --surface-0: #0B1220;
  --surface-1: #0F172A;
  --surface-2: #111827;
  --text-900: #E5E7EB;
  --text-700: #CBD5E1;
  --grad-header: linear-gradient(135deg, #0B1220, #0F172A 60%, #1E293B);
}

/* ===== Reset / base ===== */
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  background: var(--surface-1);
  color: var(--text-900);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== Utilidades ===== */
.container { width: min(1200px,88vw); margin-inline: auto; }
.elev-1 { box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); }
.round { border-radius: 12px; }

/* Botones base */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: .5rem; padding: .75rem 1.25rem; border-radius: 10px;
  font-weight: 600; text-decoration: none; cursor: pointer;
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
  border: 1px solid transparent;
}
.btn:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }

/* Botón primario (azul, moderno con gradiente) */
.btn-primary {
  color: #fff; background: var(--grad-cta);
  box-shadow: 0 8px 24px rgba(37, 99, 235, .25);
}
.btn-primary:hover { transform: translateY(-2px); }

/* Botón borde (azul suave) */
.btn-outline {
  background: transparent; color: var(--brand-600); border-color: var(--brand-300);
}
.btn-outline:hover { background: rgba(96, 165, 250, .12); }

/* Botón fantasma (texto azul) */
.btn-ghost {
  background: transparent; color: var(--brand-500);
}
.btn-ghost:hover { background: rgba(96, 165, 250, .08); }

```
