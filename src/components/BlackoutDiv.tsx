import React from 'react';

type BlackoutDivProps = {
  readOnlyMode: boolean
  toggleEditMode?: Function
  zIndex: number
}

function BlackoutDiv({ readOnlyMode, toggleEditMode, zIndex = 1000 }: BlackoutDivProps) {
  const [noOfClicks, setNoOfClicks] = React.useState(0)

  // Reset noOfClicks after 1 second
  React.useEffect(() => {
    if (noOfClicks > 0) {
      const timeout = setTimeout(() => {
        setNoOfClicks(0)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [noOfClicks])

  return (
    <div
      onClick={() => {
        if (toggleEditMode) {
          setNoOfClicks((noOfClicks) => (noOfClicks + 1))
          if (noOfClicks >= 1) {
            setNoOfClicks(0)
            toggleEditMode()
          }
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: readOnlyMode ? 'rgba(0, 0, 0, 0.0)' : 'rgba(0, 0, 0, 0.5)',
        transition: 'background 0.3s ease',
        pointerEvents: readOnlyMode ? 'none' : 'auto',
        zIndex: readOnlyMode ?  0 : zIndex,
      }}
    />
  )
}

export default BlackoutDiv;

