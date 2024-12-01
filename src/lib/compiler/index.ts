import DOMPurify from "dompurify";

const exampleHtml = `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="This is an example page." />
        <title>Example Page</title>
        <link rel="stylesheet" href="/assets/styles.css" onload="alert('CSS Loaded')" />
        <link rel="stylesheet" href="another-style.css" />
        <script src="script.js"></script>
        <script>alert('Malicious Script #1');</script>
        <script type="text/javascript">
            document.body.innerHTML = 'Malicious Script #2 - Content Replaced';
        </script>
    </head>
    <body onload="alert('Body loaded')" onmouseover="alert('Mouse Over')" onscroll="alert('Scrolling')">
        <div id="app" onclick="alert('App Clicked')" style="background: url(javascript:alert('Injected URL'));">
            Welcome to the app! <iframe src="javascript:alert('Embedded JS iframe')" style="display:none"></iframe>
        </div>
        <p onmouseover="alert('Hovered over text')">This should not be allowed.</p>
        <a href="javascript:alert('JavaScript Link Clicked')">Click Me</a>
        <button onclick="alert('Button Clicked')">Malicious Button</button>
        <img src="invalid-image.png" onerror="alert('Image Failed to Load - Trigger JS')" />
        <form action="javascript:alert('Form Submission Executed')" method="post">
            <input type="text" name="maliciousInput" value="Malicious Value" />
            <input type="submit" value="Submit Malicious Form" />
        </form>
    </body>
    </html>`;

type RelativePath = string;
// Define types for head and body elements
type ScriptElement = {
  src: RelativePath | null;
  content: string;
  type: "text/javascript" | "module";
};

interface StylesheetElement {
  href: RelativePath | null;
  content: string;
}

interface MetaElement {
  name: RelativePath;
  content: string | null;
}

interface ExtractedHTML {
  scripts: ScriptElement[]; // Combined scripts from both head and body
  stylesheets: StylesheetElement[];
  metas: MetaElement[];
  body: string;
}

function sanitizeHTML(dirtyHTML: string): string {
  return DOMPurify.sanitize(dirtyHTML, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "i",
      "u",
      "p",
      "div",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "br",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
    FORBID_ATTR: ["style"],
    KEEP_CONTENT: false,
  });
}

export function compile(html: string): ExtractedHTML {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const stylesheets = [...doc.head.getElementsByTagName("link")]
    .filter((e) => e.getAttribute("rel") === "stylesheet")
    .map((e) => ({
      href: e.getAttribute("href"),
      content: e.innerHTML.trim(),
    }));

  const metas = [...doc.head.getElementsByTagName("meta")]
    .map((e) => {
      const name = e.getAttribute("name");
      if (!name) return;
      return { name, content: e.getAttribute("content") };
    })
    .filter((x) => !!x);

  const scripts = [
    ...doc.head.getElementsByTagName("script"),
    ...doc.body.getElementsByTagName("script"),
  ].map((e) => ({
    src: e.getAttribute("src"),
    content: e.innerHTML.trim(),
    type: (e.getAttribute("type") ?? "text/javascript") as
      | "module"
      | "text/javascript",
  }));

  // Extract and sanitize body content
  const bodyContent = doc.body.innerHTML;
  const body = sanitizeHTML(bodyContent);

  return {
    scripts,
    stylesheets,
    metas,
    body,
  };
}

export type CompileResult = ReturnType<typeof compile>;
