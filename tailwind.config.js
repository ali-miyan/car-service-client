import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "bai-regular": ["bai regular"],
        "bai-medium": ["bai medium"],
        "bai-light": ["bai light"],
        "bai-extra-light": ["bai extra light"],
        "bai-semi-bold": ["bai semi bold"],
        "bai-bold": ["bai bold"],
      },
      zIndex: {
        '100': '100',
      },
      scale: {
        '99': '0.99',
      },
    },
  },
  plugins: [],
});
