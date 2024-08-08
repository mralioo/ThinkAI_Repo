export async function POST(req: Request) {
  const { message } = await req.json();
  console.log("Req", message);

  await new Promise((resolve) => {
    setTimeout(() => {
      return resolve(1);
    }, 2000);
  });
  return new Response(JSON.stringify({ message: "Hello World" }));
}
