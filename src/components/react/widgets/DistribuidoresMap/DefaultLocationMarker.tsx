import React, { useCallback, useState } from 'react';
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { PlaceOverview } from '@googlemaps/extended-component-library/react';
import { useIsMobile } from '../../hooks/useIsMobile';

// Cores do projeto Cajuína
const PIN_COLORS = {
  default: '#09863C',
  hover: '#F4B013',
  border: '#00422a',
  glyph: '#ffffffff',
};

interface DefaultLocationMarkerProps {
  position: google.maps.LatLngLiteral;
  placeId: string;
}

export const DefaultLocationMarker: React.FC<DefaultLocationMarkerProps> = ({
  position,
  placeId,
}) => {
  const isMobile = useIsMobile();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isHovered, setIsHovered] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(!isMobile);

  const handleClick = useCallback(() => {
    setShowInfoWindow((prev) => (isMobile ? false : !prev));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setShowInfoWindow(false);
  }, []);

  const scale = isHovered ? 1.2 : 1;
  const pinBackground = isHovered ? PIN_COLORS.hover : PIN_COLORS.default;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const markers = document.querySelectorAll('gmp-advanced-marker');

      markers.forEach((m) =>
        m.setAttribute('aria-label', 'Localização no mapa')
      );
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="default-location-marker"
        ariaLabel="Localização da fábrica no mapa"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: AdvancedMarkerAnchorPoint.BOTTOM.join(' '),
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <Pin
          background={pinBackground}
          borderColor={PIN_COLORS.border}
          glyphColor={PIN_COLORS.glyph}
        />
      </AdvancedMarker>

      {showInfoWindow && marker && (
        <InfoWindow
          id="default-location-marker-info-window"
          anchor={marker}
          onCloseClick={handleInfoWindowClose}
          headerDisabled={false}
          ariaLabel="Informações sobre o local"
          title="Informações sobre o local"
        >
          <PlaceOverview
            place={placeId}
            size="medium"
            googleLogoAlreadyDisplayed
            className="min-w-[300px]"
          />
        </InfoWindow>
      )}
    </>
  );
};

export default React.memo(DefaultLocationMarker);
