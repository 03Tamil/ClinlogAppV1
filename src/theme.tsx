import { background, border, extendTheme } from "@chakra-ui/react";
import zIndex from "@mui/material/styles/zIndex";
import { max } from "date-fns";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const fonts = {
  mono: `'Menlo', monospace`,
  inter: inter.style.fontFamily,
  Inter: inter.style.fontFamily,
};

const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  "2lg": "1700px",
  xl: "1280px",
  "2xl": "2000px",
};
const colors = {
  // darkBlueLogo: "#0F1F65",
  xlDarkBlueLogo: "#1c1b4b",
  lgDarkBlueLogo: "#2a2e6e",
  // darkBlueLogo: "#293991",
  // darkBlueLogo: "#001799",
  darkBlueLogo: "#00029a",
  medBlueLogo: "#448FFF",
  caseNotes: "rgb(237,238,249)",
  lightBlueLogo: "#ebebf6",
  proposalBlueHeading: "#00abef",
  primary: "#448FFF",
  scBlue: "#0E11C7",
  scBlack: "#111111",
  scLightGrey: "#F5F5F5",
  scGrey: "#767676",
};
const components = {
  Badge: {
    variants: {
      darkRed: {
        bg: "rgb(227,217,228)",
        color: "rgb(171,54,73)",
      },
      darkGreen: {
        bg: "rgb(197,225,208)",
        color: "rgb(82,167,60)",
      },
    },
  },
  Button: {
    variants: {
      roleButton: {
        border: "1px solid",
        borderColor: "darkBlueLogo",
        _hover: {
          backgroundColor: "darkBlueLogo",
          color: "white",
        },
        _active: {
          backgroundColor: "darkBlueLogo",
          color: "white",
        },
      },
      filterButton: {
        borderRadius: "none",
        height: "100%",
        _active: {
          // borderBottom: "3px solid",
          // borderColor: "darkBlueLogo",
          transform: "translateY(-4px)",
          // boxShadow: "2px 5px 5px rgba(0,0,0,0.5)"
        },
      },
    },
  },
  Divider: {
    variants: {
      sidebar: {
        bgColor: "gray.300",
        height: "2.5px",
      },
    },
  },
  Container: {
    sizes: {
      base: {
        maxW: "1920px",
        px: {
          base: 6,
          lg: 8,
        },
      },
      lg: {
        maxW: "1728px",
        px: {
          base: 6,
          lg: 8,
        },
      },
      main: {
        maxW: "2000px",
        px: "10px",
      },
      blog: {
        maxW: "1200px",
        px: {
          base: 6,
          lg: 8,
        },
      },
    },
    defaultProps: {
      size: "main",
    },
  },
  Link: {
    baseStyle: {
      _hover: {
        textDecoration: "none",
      },
    },
  },
  Table: {
    variants: {
      test: {
        thead: {
          Th: {
            backgroundColor: "#d6def2",
            border: "1px solid",
            borderColor: "darkBlueLogo",
            color: "darkBlueLogo",
            fontFamily: "Inter",
            fontWeight: "900",
          },
        },
        tbody: {
          Th: {
            backgroundColor: "#fff",
            border: "1px solid",
            borderColor: "darkBlueLogo",
          },
          Td: {
            backgroundColor: "#fff",
            border: "1px solid",
            borderColor: "darkBlueLogo",
          },
        },
      },
    },
  },
};

const semanticTokens = {
  colors: {
    bgColor: {
      default: "#f0e7db",
      _dark: "#1e1e24",
    },
    basicShade: {
      default: "#000000",
      _dark: "#FFFFFF",
    },
    navBgColor: {
      default: "#ffffff20",
      _dark: "#20202380",
    },
    linkColor: {
      default: "gray200",
      _dark: "whiteAlpha.900",
    },
    headingText: {
      default: "gray.800",
      _dark: "whiteAlpha.900",
    },
    sectionHeading: {
      default: "#c1a749",
      _dark: "#c1a749",
    },
    cardHeading: {
      default: "#152a49",
      _dark: "#204171",
    },
    text: {
      default: "#16161D",
      _dark: "#ade3b8",
    },
    primary: {
      default: "#448FFF",
      _dark: "#448FFF",
    },
    secondary: {
      default: "#eaeff9",
      _dark: "#eaeff9",
    },
  },
  radii: {
    button: "12px",
  },
};

const styles = {
  global: {
    ".patientFormPdf": {
      ".patientFormPdfHeading": {},
    },
    ".rich-text": {
      a: {
        color: "primary",
        _hover: {
          opacity: 0.8,
        },
      },
      h2: {
        fontSize: "1.6rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        color: "xlDarkBlueLogo",
      },
      h3: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        color: "xlDarkBlueLogo",
      },
      p: {
        marginBottom: "1rem",
      },
      ol: {
        marginLeft: "2rem",
        marginBottom: "1rem",
      },
      ul: {
        marginLeft: "2rem",
        marginBottom: "1rem",
      },
      li: {
        "::marker": {
          fontWeight: "bold",
        },
      },
    },
    ".site-agreement-heading": {
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "1.0rem",
      textTransform: "uppercase",
    },
    ".link": {
      color: "#448FFF !important",
      fontWeight: "bold",
      transition: "all 0.2s ease-in-out",
      _hover: {
        opacity: 0.8,
      },
    },
    ".simple-table-container": {
      maxWidth: "100%",
      overflowX: "scroll",
    },
    ".list-disc": {
      listStyleType: "disc",
      paddingLeft: "0",
      "& > li": {
        marginBottom: "0.4rem",
      },
    },
    ".list-unstyled": {
      listStyleType: "none",
      paddingLeft: "0",
      "& > li": {
        marginBottom: "0.4rem",
      },
    },
    ".bracketed-list-alpha": {
      counterReset: "item",
      listStyleType: "none",
      paddingLeft: "0",
      "& > li": {
        position: "relative",
        paddingLeft: "1rem",
        marginBottom: "0.4rem",
      },
      "& > li::before": {
        content: `"(" counter(item, lower-alpha) ")"`,
        counterIncrement: "item",
        position: "absolute",
        left: "-2rem",
      },
    },
    ".bracketed-list-roman": {
      counterReset: "item",
      listStyleType: "none",
      paddingLeft: "0",
      "& > li": {
        position: "relative",
        paddingLeft: "1rem",
        marginBottom: "0.4rem",
      },
      "& > li::before": {
        content: `"(" counter(item, lower-roman) ")"`,
        counterIncrement: "item",
        position: "absolute",
        left: "-2rem",
      },
    },
    ".nested-list": {
      listStyleType: "none",
      counterReset: "item",
      paddingLeft: "0",
      "& > li": {
        position: "relative",
        paddingLeft: "1rem",
        marginBottom: "0.4rem",
      },
      "& > li:before": {
        content: `counters(item, ".") ". "`,
        counterIncrement: "item",
        position: "absolute",
        left: "-2rem",
      },
    },
    ".rich-text-editor": {
      cursor: "text",
      minHeight: "200px",
      maxHeight: "90%",
    },
    ".forced-scrollbar": {
      scrollbarGutter: "stable",
    },
    ".forced-scrollbar::-webkit-scrollbar": {
      width: "12px",
    },
    ".forced-scrollbar::-webkit-scrollbar-track": {
      background: "#f0f0f0",
    },
    ".forced-scrollbar::-webkit-scrollbar-thumb": {
      background: "#c1c1c1",
      borderRadius: "6px",
      border: "2px solid #f0f0f0", /* ← acts like margin */
      backgroundClip: "padding-box",
    },
    

    // ".rdw-editor-toolbar": {
    //   visibility: "visible",
    //   position: "absolute",
    //   background: "white",
    //   maxWidth: "65%",
    //   zIndex: 2
    // }
  },
};

const customTheme = extendTheme({
  styles,
  semanticTokens,
  colors,
  components,
  fonts,
  breakpoints,
});

export default customTheme;
