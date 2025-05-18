import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const { userId: currentUserId } = auth()
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!currentUserId || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const messages = await db.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  })

  const contact = await db.user.findUnique({
    where: { id: userId },
  })

  return NextResponse.json({ messages, contact })
}

export async function POST(req) {
  const { userId: senderId } = auth()
  if (!senderId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { receiverId, content } = await req.json()

  const message = await db.message.create({
    data: {
      senderId,
      receiverId,
      content,
    },
  })

  return NextResponse.json(message)
}
