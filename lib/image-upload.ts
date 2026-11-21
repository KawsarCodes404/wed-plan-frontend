export async function uploadProfileImage(file: File): Promise<string> {
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"]
  if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024)
    throw new Error("Choose an image under 5 MB.")

  const form = new FormData()
  form.set("image", file)
  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  ).replace(/\/$/, "")
  const response = await fetch(`${apiBase}/images/upload`, {
    method: "POST",
    body: form,
  })
  const result = (await response.json()) as {
    url?: string
    message?: string
  }
  if (!response.ok || !result.url)
    throw new Error(result.message || "Image upload failed. Please try again.")
  return result.url
}
