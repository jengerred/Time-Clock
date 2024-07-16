import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Punch from "@/models/punch";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { userId, type } = await req.json();
    const punch = new Punch({ userId, type });
    await punch.save();
    return NextResponse.json(punch);
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { id } = await req.json();
    await Punch.findByIdAndRemove(id);
    return NextResponse.json({ message: "Punch deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}