import { useState } from 'react';
import type { Distribuidor } from '@/types';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { AutoCompleteSearchBox } from './AutoCompleteSearchBox';
import DistribuidorMarker from './DistribuidorMarker';
import DefaultLocationMarker from './DefaultLocationMarker';
import { useDistribuidorMarkers } from '../../hooks/useDistribuidorMarkers';
import useGmapsActions from '../../hooks/useGmapsActions';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  distribuidores: Distribuidor[];
  apiKey: string;
  defaultPosition: google.maps.LatLngLiteral & { placeId: string };
}

function Gmaps({ distribuidores, defaultPosition }: Omit<Props, 'apiKey'>) {
  const [sortedDistribuidores, setSortedDistribuidores] = useState<Distribuidor[]>([]);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const isMobile = useIsMobile();

  const map = useMap();

  const { hoveredId, selectedId, handleMarkerHover, handleMarkerSelect, resetMarkers } =
    useDistribuidorMarkers();

  const {
    handleCardClick,
    handleUseCurrentLocation,
    handlePlaceSelect,
    handleReset,
    isSearchLoading,
    isInitialState,
  } = useGmapsActions({
    map,
    defaultPosition,
    distribuidores,
    setSortedDistribuidores,
    onResetMarkers: resetMarkers,
    onSelectMarker: (id) => {
      handleMarkerSelect(id);
      setInfoWindowShown(true);
    },
  });

  const handleMarkerClick = (id: number, marker: google.maps.marker.AdvancedMarkerElement) => {
    handleMarkerSelect(id);
    setInfoWindowShown((prev) => (selectedId === id ? !prev : true));

    if (map) {
      map.panTo({
        lat: marker.position!.lat as number,
        lng: marker.position!.lng as number,
      });
      map.setZoom(18);
    }
  };

  const handleInfoWindowClose = () => {
    setInfoWindowShown(false);
    handleMarkerSelect(null);

    // Volta para os bounds de todos os distribuidores
    if (map && sortedDistribuidores.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      sortedDistribuidores.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
      map.fitBounds(bounds, 90);

      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 18) {
          map.setZoom(18);
        }
      });
    }
  };

  const handleMapClick = () => {
    handleMarkerSelect(null);
    setInfoWindowShown(false);
  };

  return (
    <section id="nos-encontre" className="min-h-[521px] w-full px-4 lg:px-12">
      {isMobile && (
        <h2 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
          Nos encontre perto de você
        </h2>
      )}

      <div className="flex flex-col items-center justify-center! lg:justify-between! gap-6 lg:flex-row-reverse lg:gap-8">
        {/* Map and markers */}
        <div className="h-[237px] w-full rounded-xl! md:min-h-[500px] lg:ml-12 lg:min-h-[600px] lg:flex-2">
          <Map
            onClick={handleMapClick}
            className="h-full w-full rounded-md!"
            defaultCenter={defaultPosition}
            defaultZoom={16}
            renderingType="VECTOR"
            gestureHandling="cooperative"
            mapTypeControl={false}
            cameraControl={false}
            mapId="DISTRIBUIDORES_MAP"
          >
            {/* Renderiza markers apenas para distribuidores filtrados/selecionados */}
            {sortedDistribuidores.map((dist) => (
              <DistribuidorMarker
                key={`${dist.id}-${dist.lat}-${dist.lng}`}
                distribuidor={dist}
                isHovered={hoveredId === dist.id}
                isSelected={selectedId === dist.id}
                onHover={handleMarkerHover}
                onSelect={handleMarkerClick}
                showInfoWindow={infoWindowShown && selectedId === dist.id}
                onInfoWindowClose={handleInfoWindowClose}
              />
            ))}

            {/* Mostra marker da localização padrão apenas quando não há busca ativa */}
            {isInitialState && (
              <DefaultLocationMarker position={defaultPosition} placeId={defaultPosition.placeId} />
            )}
          </Map>
        </div>

        {/* Search and distribuidores */}
        <div className="w-full lg:flex lg:flex-2 lg:items-center lg:justify-center border border-gray-300 rounded-xl shadow-xl  p-4 md:py-8 md:px-4">
          <div className="flex w-full flex-col">
            {/* Title Desktop */}
            {!isMobile && (
              <h2 className="text-xxs text-caju-heading-primary scale-95 font-bold uppercase">
                Nos encontre
                <br />
                perto de você
              </h2>
            )}

            {/* Search and distribuidores */}
            <div className="bg-white p-4 rounded-md">
              {/* Search */}
              <AutoCompleteSearchBox onPlaceSelect={handlePlaceSelect} onReset={handleReset} />

              {isSearchLoading && (
                <div className="font-inter flex items-center justify-center gap-2 py-4">
                  <div className="border-caju-heading-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span className="text-sm text-gray-600">Buscando distribuidores próximos...</span>
                </div>
              )}

              {!isSearchLoading && sortedDistribuidores.length === 0 && (
                <div className="font-inter flex flex-wrap items-center justify-start gap-1 py-5 ml-2">
                  <p className="text-center">
                    Use sua localização para encontrar distribuidores próximos
                  </p>
                  <button
                    onClick={handleUseCurrentLocation}
                    className="btn-green px-6 py-3 whitespace-nowrap lg:text-base"
                    title="Usar minha localização"
                  >
                    📍 Usar Minha Localização
                  </button>
                </div>
              )}

              {!isSearchLoading && sortedDistribuidores.length > 0 && (
                <div className="hide-scrollbar flex cursor-grab gap-2 my-2 lg:flex-col max-h-[300px] max-w-[650px] overflow-y-scroll">
                  {sortedDistribuidores.map((dist) => (
                    <div
                      className="font-inter min-w-[225px] cursor-pointer border-2 border-gray-200 bg-[#FEF7FF] px-4 py-1 font-medium hover:border-gray-300 hover:shadow-md lg:max-h-24 lg:max-w-[650px]"
                      key={dist.id + dist.lat + dist.nome}
                      onClick={() => handleCardClick(dist)}
                    >
                      <p className="text-caju-heading-primary mb-0! text-base! font-bold">
                        {dist.nome}
                      </p>
                      <p>{dist.endereco}</p>
                      <p>{dist.telefone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="[&_button]:font-inter! flex gap-3 self-start [&_button]:h-[45px] [&_button]:text-xs [&_button]:font-medium [&_button]:lg:h-[65px] [&_button]:lg:text-xl">
              <button onClick={handleUseCurrentLocation} className="btn-green px-6">
                VER MAIS
              </button>
              <button className="btn-yellow max-w-80 flex-1">
                <a className="uppercase" href="/solicite/seja-um-distribuidor/">
                  seja um distribuidor
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DistribuidoresGmaps({
  distribuidores = [],
  apiKey,
}: Omit<Props, 'defaultPosition'>) {
  const saoGeraldoPosition = {
    lat: -7.225938,
    lng: -39.329313,
    placeId: 'ChIJ4ySFSl2CoQcR3LgbM8Nx8_U',
  };

  return (
    <APIProvider
      language="pt-BR"
      apiKey={apiKey}
      region="BR"
      version="beta"
      authReferrerPolicy="origin"
    >
      <Gmaps distribuidores={distribuidores} defaultPosition={saoGeraldoPosition} />
    </APIProvider>
  );
}
