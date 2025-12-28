import { requireOwner } from "../../../lib/auth";
import { normalizeTheme, Theme } from "../../../lib/db";
import { updateThemeAction } from "../actions";

export default async function ThemePage() {
  const { blog } = await requireOwner();
  const theme = normalizeTheme(blog.theme_json as Theme);

  async function action(formData: FormData) {
    "use server";
    const { blog: freshBlog } = await requireOwner();
    const current = normalizeTheme(freshBlog.theme_json as Theme);
    const nextTheme: Theme = {
      ...current,
      template: formData.get("template") as Theme["template"],
      width: formData.get("width") as Theme["width"],
      colors: {
        ...current.colors,
        background: String(formData.get("background")),
        accent: String(formData.get("accent"))
      }
    };

    await updateThemeAction(nextTheme);
  }

  return (
    <section className="space-y-8">
      <h1 className="text-[12px] uppercase tracking-[0.2em] text-muted">Theme</h1>
      <form action={action} className="space-y-10 text-sm">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">Layout</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[12px] text-muted">Template</span>
                <select name="template" defaultValue={theme.template} className="input-minimal">
                  <option value="minimal">Minimal</option>
                  <option value="notebook">Notebook</option>
                  <option value="typewriter">Typewriter</option>
                </select>
                <p className="text-[12px] text-muted">Subtle shifts in spacing and tone.</p>
              </label>
              <label className="space-y-2">
                <span className="text-[12px] text-muted">Width</span>
                <select name="width" defaultValue={theme.width} className="input-minimal">
                  <option value="narrow">Narrow</option>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                </select>
                <p className="text-[12px] text-muted">Narrow reads like a book.</p>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">Colors</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[12px] text-muted">Background</span>
                <input
                  name="background"
                  defaultValue={theme.colors.background}
                  className="input-minimal"
                  placeholder="#111110"
                />
                <p className="text-[12px] text-muted">Warm off-white or deep charcoal.</p>
              </label>
              <label className="space-y-2">
                <span className="text-[12px] text-muted">Accent</span>
                <input
                  name="accent"
                  defaultValue={theme.colors.accent}
                  className="input-minimal"
                  placeholder="#b9a88f"
                />
                <p className="text-[12px] text-muted">Used only for links.</p>
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="editor-button text-[12px] uppercase tracking-[0.18em]">
          Save theme
        </button>
      </form>
    </section>
  );
}
