import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}
