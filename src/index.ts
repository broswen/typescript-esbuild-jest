// Make sure we export the Counter Durable Object class
export { Counter } from "./counter";

export type Env = {
  COUNTER: DurableObjectNamespace
  TEST: string
  SECRET: string
}

export async function handleRequest(request: Request, env: Env) {
  console.log(env)
  // Match route against pattern /:name/*action
  const url = new URL(request.url);
  const match = /\/(?<name>[^/]+)(?<action>.*)/.exec(url.pathname);
  if (!match?.groups) {
    // If we didn't specify a name, default to "test"
    return Response.redirect(`${url.origin}/test/increment`, 302);
  }

  // Forward the request to the named Durable Object...
  const { COUNTER } = env;
  const id = COUNTER.idFromName(match.groups.name);
  const stub = COUNTER.get(id);
  // ...removing the name prefix from URL
  url.pathname = match.groups.action;
  return stub.fetch(url.toString(), {headers: request.headers});
}

const worker: ExportedHandler<Env> = { fetch: handleRequest };
export default worker;
