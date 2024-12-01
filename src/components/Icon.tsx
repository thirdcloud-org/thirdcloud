export default function Icon(props: { src: string; size: "sm" | "md" | "lg" }) {
  return (
    <img
      data-size={props.size}
      src={props.src}
      class=" overflow-hidden border data-[size=sm]:w-10 data-[size=sm]:h-10 data-[size=md]:w-12 data-[size=md]:h-12 data-[size=lg]:w-14 data-[size=lg]:h-14"
      style={{
        "border-radius": "calc(0.25 * 100%)",
      }}
    />
  );
}
