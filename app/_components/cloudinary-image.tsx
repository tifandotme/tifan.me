import "server-only"
import Image, { type ImageProps } from "next/image"

export type CloudinaryImageProps = Omit<
  ImageProps,
  "src" | "height" | "placeholder" | "blurDataURL"
> & {
  publicId: string
  width: number
}

export async function CloudinaryImage({
  publicId,
  width,
  ...props
}: CloudinaryImageProps) {
  try {
    const imageResponse = await fetch(
      `https://res.cloudinary.com/tifan/$w_${width}/t_1/fl_getinfo/${publicId}`,
      { cache: "force-cache" },
    )
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image metadata: ${imageResponse.status}`)
    }

    const imageInfo: unknown = await imageResponse.json()
    if (
      typeof imageInfo !== "object" ||
      imageInfo === null ||
      !("output" in imageInfo)
    ) {
      throw new Error("Cloudinary returned invalid image metadata")
    }
    const { output } = imageInfo
    if (
      typeof output !== "object" ||
      output === null ||
      !("height" in output) ||
      typeof output.height !== "number" ||
      !Number.isSafeInteger(output.height) ||
      output.height < 1
    ) {
      throw new Error("Cloudinary returned invalid image dimensions")
    }
    const { height } = output

    const placeholderResponse = await fetch(
      `https://res.cloudinary.com/tifan/t_placeholder/${publicId}`,
      { cache: "force-cache" },
    )
    if (!placeholderResponse.ok) {
      throw new Error(
        `Failed to fetch image placeholder: ${placeholderResponse.status}`,
      )
    }
    const contentType = placeholderResponse.headers.get("content-type")
    if (!contentType?.startsWith("image/")) {
      throw new Error("Cloudinary returned an invalid image placeholder")
    }
    const placeholder = Buffer.from(await placeholderResponse.arrayBuffer())
    const blurDataURL = `data:${contentType};base64,${placeholder.toString("base64")}`

    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        src={publicId}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={blurDataURL}
        {...props}
      />
    )
  } catch (err) {
    console.error(err instanceof Error ? err.message : "An error occured")
    return null
  }
}
