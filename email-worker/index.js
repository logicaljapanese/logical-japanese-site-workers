import { request } from "http"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request)
    .catch(e => {
      console.log(JSON.stringify(e))
    }))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  if (request.method === "OPTIONS") {
    return handleOptions(request)
  } else if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405
    });
  }

  try {
    return fetch(SENDGRID_API_ENDPOINT, {
      method: "POST",
      body: request.body,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${SENDGRID_API_KEY}`,
        "Access-Control-Allow-Origin": "*"
      },
      responseType: "text"
    });
  } catch (error) {
    console.error(error);
  }

}

function handleOptions(request) {
  if (request.headers.get("Origin") !== null &&
      request.headers.get("Access-Control-Request-Method") !== null &&
      request.headers.get("Access-Control-Request-Headers") !== null) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders
    })
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        "Allow": "GET, HEAD, POST, OPTIONS",
      }
    })
  }
}
