type Props = {
  fontFamily: string;
};

export default function FontFamily({ fontFamily }: Props) {
  let value = "var(--default-font)";

  if (fontFamily?.trim().length > 0) {
    value = `${fontFamily}, var(--default-font)`;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { --content-font: ${value}; }`,
      }}
    />
  );
}
