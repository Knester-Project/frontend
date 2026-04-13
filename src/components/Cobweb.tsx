

const Cobweb = ({ color = '#777777', className = '' }) => {
    return (
        <div
            className={`cobweb-container ${className} size-32 md:size-40 xl:size-44`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
            <style>
                {`
          @keyframes cobwebSway {
            0% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              /* A tiny sway and slight perspective shift */
              transform: rotate(1.5deg) scale(1.02) rotateX(2deg);
            }
            100% {
              transform: rotate(0deg) scale(1);
            }
          }

          .animated-cobweb-svg {
            animation: cobwebSway 6s ease-in-out infinite;
            /* Ensure the animation originates from the center */
            transform-origin: center center;
            /* Hardware acceleration hint */
            will-change: transform; 
          }
        `}
            </style>

            <svg className="animated-cobweb-svg"
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%', stroke: color, strokeWidth: 0.8, fill: 'none', transition: 'stroke 0.3s ease' }}>
                {/* Radial Spokes */}
                <line x1="50" y1="50" x2="50" y2="0" />
                <line x1="50" y1="50" x2="85" y2="15" />
                <line x1="50" y1="50" x2="100" y2="50" />
                <line x1="50" y1="50" x2="85" y2="85" />
                <line x1="50" y1="50" x2="50" y2="100" />
                <line x1="50" y1="50" x2="15" y2="85" />
                <line x1="50" y1="50" x2="0" y2="50" />
                <line x1="50" y1="50" x2="15" y2="15" />

                {/* Spiral Rings */}
                <path d="M50 10 A40 40 0 0 1 80 20 L80 20 A40 40 0 0 1 90 50 L90 50 A40 40 0 0 1 80 80 L80 80 A40 40 0 0 1 50 90 L50 90 A40 40 0 0 1 20 80 L20 80 A40 40 0 0 1 10 50 L10 50 A40 40 0 0 1 20 20 L20 20 A40 40 0 0 1 50 10 Z" />
                <path d="M50 20 A30 30 0 0 1 72.5 27.5 L72.5 27.5 A30 30 0 0 1 80 50 L80 50 A30 30 0 0 1 72.5 72.5 L72.5 72.5 A30 30 0 0 1 50 80 L50 80 A30 30 0 0 1 27.5 72.5 L27.5 72.5 A30 30 0 0 1 20 50 L20 50 A30 30 0 0 1 27.5 27.5 L27.5 27.5 A30 30 0 0 1 50 20 Z" />
                <path d="M50 30 A20 20 0 0 1 65 35 L65 35 A20 20 0 0 1 70 50 L70 50 A20 20 0 0 1 65 65 L65 65 A20 20 0 0 1 50 70 L50 70 A20 20 0 0 1 35 65 L35 65 A20 20 0 0 1 30 50 L30 50 A20 20 0 0 1 35 35 L35 35 A20 20 0 0 1 50 30 Z" />
                <path d="M50 40 A10 10 0 0 1 57.5 42.5 L57.5 42.5 A10 10 0 0 1 60 50 L60 50 A10 10 0 0 1 57.5 57.5 L57.5 57.5 A10 10 0 0 1 50 60 L50 60 A10 10 0 0 1 42.5 57.5 L42.5 57.5 A10 10 0 0 1 40 50 L40 50 A10 10 0 0 1 42.5 42.5 L42.5 42.5 A10 10 0 0 1 50 40 Z" />
            </svg>
        </div>
    );
};

export default Cobweb;