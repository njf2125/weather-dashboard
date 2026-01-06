interface Env {
  OPENWEATHER_API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = url.searchParams;
  const type = params.get("type");

  if (!type) {
    return new Response("Missing 'type' parameter", { status: 400 });
  }

  let apiUrl = "";
  
  // Clone params to avoid side effects if request is reused (though not reused here)
  const newParams = new URLSearchParams(params);
  newParams.delete("type"); // Remove internal 'type' param
  newParams.append("appid", env.OPENWEATHER_API_KEY); // Inject the secret key

  switch (type) {
    case "onecall":
      apiUrl = "https://api.openweathermap.org/data/3.0/onecall";
      break;
    case "direct":
      apiUrl = "https://api.openweathermap.org/geo/1.0/direct";
      break;
    case "zip":
      apiUrl = "https://api.openweathermap.org/geo/1.0/zip";
      break;
    case "reverse":
      apiUrl = "https://api.openweathermap.org/geo/1.0/reverse";
      break;
    default:
      return new Response("Invalid 'type' parameter", { status: 400 });
  }

  const fullUrl = `${apiUrl}?${newParams.toString()}`;

  try {
    const response = await fetch(fullUrl);
    
    // Check if upstream response is ok
    if (!response.ok) {
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: { "Content-Type": "application/json" }
        });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch weather data" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }
};
