export async function GET() {
  return Response.json({
    message: "Hello World",
    method: "GET",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request) {
  const body = await request.json();
  console.log(body);
  return Response.json(
    {
      message: "Hello World - Data Created",
      method: "POST",
      receivedData: body,
      timestamp: new Date().toISOString(),
    },
    { status: 201 }
  );
}

export async function PUT(request) {
  const body = await request.json();
  return Response.json({
    message: "Hello World - Data Updated",
    method: "PUT",
    updatedData: body,
    timestamp: new Date().toISOString(),
  });
}

export async function DELETE() {
  return Response.json({
    message: "Hello World - Data Deleted",
    method: "DELETE",
    timestamp: new Date().toISOString(),
  });
}
