import "../Public/css/logo.css"

export default function LogoGadder({ tamaño = "normal", colorPrimario = "#3b82f6", colorSecundario = "#8b5cf6" }) {
  // Determinar tamaño del logo
  const obtenerTamaño = () => {
    switch (tamaño) {
      case "pequeño":
        return { width: 32, height: 32 }
      case "normal":
        return { width: 48, height: 48 }
      case "grande":
        return { width: 64, height: 64 }
      case "extraGrande":
        return { width: 96, height: 96 }
      default:
        return { width: Number.parseInt(tamaño), height: Number.parseInt(tamaño) }
    }
  }

  const { width, height } = obtenerTamaño()

  return (
    <div className="contenedor-logo-gadder">
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-logo-gadder"
      >
        {/* Círculo de fondo */}
        <circle cx="50" cy="50" r="50" fill={colorPrimario} />

        {/* Letra G estilizada */}
        <path
          d="M65 30C57.5 22.5 45.5 22.5 38 30C30.5 37.5 30.5 49.5 38 57L50 69L62 57C69.5 49.5 69.5 37.5 62 30"
          fill={colorSecundario}
        />

        {/* Detalles de la G */}
        <path
          d="M50 40C45.5 40 42 43.5 42 48C42 52.5 45.5 56 50 56C54.5 56 58 52.5 58 48"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Línea horizontal */}
        <path d="M50 56V69" stroke="white" strokeWidth="6" strokeLinecap="round" />
      </svg>

      <span className="texto-logo-gadder">Gadder</span>
    </div>
  )
}
