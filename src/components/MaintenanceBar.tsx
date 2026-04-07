import { Box, Text } from "@chakra-ui/react"
import { format } from "date-fns"
import { useEffect, useState } from "react"

export default function MaintenanceBar() {
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [shouldShow, setShouldShow] = useState<boolean>(true)
  const maintenanceStartTime = "2026-01-09T07:00:00Z"
  useEffect(() => {
    if (!maintenanceStartTime) {
      setShouldShow(false)
      return
    }

    const updateTimeRemaining = () => {
      const now = new Date()
      const maintenanceStart = new Date(maintenanceStartTime)
      const diff = maintenanceStart.getTime() - now.getTime()

      // if (diff <= 0) {
      //   // Hide bar once maintenance time has passed (full maintenance mode should be enabled)
      //   // setShouldShow(false)
      //   setTimeRemaining("")
      //   return
      // }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 0) {
        setTimeRemaining(
          `Maintenance starting in ${hours}h ${minutes}m ${seconds}s`
        )
      } else if (minutes > 0) {
        setTimeRemaining(`Maintenance starting in ${minutes}m ${seconds}s`)
      } else {
        setTimeRemaining(`Maintenance starting in ${seconds}s`)
      }
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!shouldShow || !timeRemaining) return null

  return (
    <Box
      h="40px"
      bg="orange.500"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={9999}
      fontSize="xs"
      fontWeight="medium"
    >
      <Text>
        SmileConnect will be down for maintenance at{" "}
        {format(new Date(maintenanceStartTime), "dd MMM yyyy HH:mm")}:{" "}
        {/* {timeRemaining} */}
      </Text>
    </Box>
  )
}
