import { buildResponse } from "./response";
import {Env} from "@/index";

export class Counter implements DurableObject {
  count = 0
  constructor(private readonly state: DurableObjectState, private readonly env: Env) {}

  async fetch(request: Request) {
    this.count = (await this.state.storage?.get<number>('count')) ?? 0
    const { pathname } = new URL(request.url);
    let emoji = "➡️";
    if (pathname === "/increment") {
      // Increment, then store the new value
      this.count++
      this.state.storage.put("count", this.count);
      emoji = "⬆️";
    } else if (pathname === "/decrement") {
      // Decrement, then store the new value
      this.count--
      this.state.storage.put("count", this.count);
      emoji = "⬇️";
    } else if (pathname !== "/") {
      // If no route matched, return 404 response
      return buildResponse("😢 Not Found", 0, 404);
    }

    // Return response containing new value, potentially after incrementing/decrementing
    return buildResponse(emoji, this.count, 200, request.headers.get('Accept') === 'application/json');
  }
}
