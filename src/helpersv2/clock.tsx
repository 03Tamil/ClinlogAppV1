import { useState, useEffect } from "react"
import { Text } from "@chakra-ui/react"
import { format } from "date-fns"

function Clock() {
  const [date, setDate] = useState(new Date())
  function refreshClock() {
    setDate(new Date())
  }

  useEffect(() => {
    const timerId = setInterval(refreshClock, 30000)
    return function cleanup() {
      clearInterval(timerId)
    }
  }, []) 

  return (
    <Text
      fontSize="16px"
      fontWeight="300"
      letterSpacing="2px"
      fontFamily="Inter"
      textTransform="uppercase"
      color="white"
    >
      {format(date, "EEEE do MMMM, p")}
    </Text>
  )
}

export default Clock
