export async function uploadProfileImage(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) throw new Error("Image uploads are not configured yet.")
  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)
    throw new Error("Choose an image under 5 MB.")
  const form = new FormData()
  form.set("image", file)
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body: form }
  )
  const result = (await response.json()) as {
    success?: boolean
    data?: { url?: string }
    error?: { message?: string }
  }
  if (!response.ok || !result.success || !result.data?.url)
    throw new Error(
      result.error?.message || "Image upload failed. Please try again."
    )
  return result.data.url
}
