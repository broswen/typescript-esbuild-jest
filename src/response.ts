export function buildResponse(emoji: string, count: number, status = 200, json = false): Response {
  // Build a HTML response containing the text
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Example</title>
        <style>
        body {
          font-family: sans-serif;
          text-align: center;
        }
        h1 {
          font-size: 7.5rem;
        }
        p {
          color: #555555;
          font-size: 2rem;
        }
        code:not(:last-child) {
          margin-right: 2rem;
        }
        </style>
    </head>
    <body>
        <h1>${emoji} ${count}</h1>
        <p><code>/:id/</code><code>/:id/increment</code><code>/:id/decrement</code></p>
    </body>
    </html>
  `;

  if (json) {
    return new Response(JSON.stringify({
      count
    }),
        {
          status,
          headers: {
            'Content-Type': 'application/json'
          }
        })
  }

  return new Response(html, {
    status,
    headers: {
      // Content-Type must include text/html for live reload to work
      "Content-Type": "text/html; charset=UTF-8",
    },
  });
}
