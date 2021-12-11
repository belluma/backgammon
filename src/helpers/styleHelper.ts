export const center = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 500,
} as const

export const popperHidden = {
    ...center, width: "400px",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "15px",
    boxShadow: "5px 5px 28px #888888",
    opacity: 0,
    transition: "opacity 1s"
} as const
export const popperShown = {
    ...popperHidden, opacity: 1
    
}
