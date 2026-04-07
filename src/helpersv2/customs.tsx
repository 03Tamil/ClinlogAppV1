import { Box, chakra } from "@chakra-ui/react"
import { motion, isValidMotionProp } from "framer-motion"
import { useEffect, useRef } from "react"

export const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
})

export const AlwaysScrollToBottom = () => {
  const elementRef = useRef<any>()
  useEffect(() => elementRef.current.scrollIntoView(), [])
  return <div ref={elementRef} />
}

export const AlwaysScrollToTop = () => {
  const elementRef = useRef<any>()
  useEffect(() => elementRef.current.scrollIntoView(), [])
  return <div ref={elementRef} />
}


