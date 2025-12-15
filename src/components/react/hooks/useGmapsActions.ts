import type { Distribuidor } from '@/types';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

const SEARCH_RADIUS = 0.5; // ~55km

interface hookProps {
  map: google.maps.Map | null;
  defaultPosition: google.maps.LatLngLiteral;
  distribuidores: Distribuidor[];
  setSortedDistribuidores: (dists: Distribuidor[]) => void;
  onResetMarkers: () => void;
  onSelectMarker?: (id: number) => void;
}

export default function useGmapsActions({
  map,
  defaultPosition,
  distribuidores,
  setSortedDistribuidores,
  onResetMarkers,
  onSelectMarker,
}: hookProps) {
  const [isSearchLoading, setIsLoading] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const currentReferencePoint = useRef<{ lat: number; lng: number } | null>(null);
  const geolocationAttempt = useRef(0);

  // Função centralizada de reset
  const resetSearchState = () => {
    currentReferencePoint.current = null;
    setSortedDistribuidores([]);
    onResetMarkers();
  };

  const handleCardClick = (dist: Distribuidor) => {
    if (map) {
      map.panTo({ lat: dist.lat, lng: dist.lng });
      map.setZoom(18);
    }
    onSelectMarker?.(dist.id);
  };

  const adjustMapToResults = (nearby: Distribuidor[], searchLat: number, searchLng: number) => {
    if (!map) return;

    if (nearby.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      nearby.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
      map.fitBounds(bounds, 90);

      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 18) {
          map.setZoom(18);
        }
      });
    } else if (nearby.length === 1) {
      map.setCenter({ lat: nearby[0].lat, lng: nearby[0].lng });
      map.setZoom(16);
    } else {
      map.setCenter({ lat: searchLat, lng: searchLng });
      map.setZoom(12);
    }
  };

  const handleRadiusFilterAndSort = (searchLat: number, searchLng: number) => {
    setIsInitialState(false);
    currentReferencePoint.current = { lat: searchLat, lng: searchLng };

    const nearby = distribuidores
      .map((dist) => ({
        ...dist,
        distance: Math.sqrt(Math.pow(dist.lat - searchLat, 2) + Math.pow(dist.lng - searchLng, 2)),
      }))
      .filter((dist) => dist.distance <= SEARCH_RADIUS)
      .sort((a, b) => a.distance - b.distance);

    setSortedDistribuidores(nearby);
    adjustMapToResults(nearby, searchLat, searchLng);
  };

  const requestGeolocation = (useHighAccuracy: boolean): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      const options: PositionOptions = {
        enableHighAccuracy: useHighAccuracy,
        timeout: useHighAccuracy ? 30000 : 10000,
        maximumAge: useHighAccuracy ? 0 : 30000,
      };

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const handleGeolocationError = (error: GeolocationPositionError, isFirstAttempt: boolean) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.error('Permissão negada', {
          description: `
            <div className="text-sm">
              <p>Para ativar a localização:</p>
              <ol className="ml-4 mt-1 list-decimal">
                <li>Clique no 🔒 na barra de endereço</li>
                <li>Permita o acesso à localização</li>
                <li>Recarregue e tente novamente</li>
              </ol>
            </div>
          `,
          duration: 8000,
        });
        geolocationAttempt.current = 0;
        break;

      case error.POSITION_UNAVAILABLE:
        toast.error('Localização indisponível', {
          description: 'Não foi possível determinar sua posição. Use a busca manual.',
          duration: 5000,
        });
        geolocationAttempt.current = 0;
        break;

      case error.TIMEOUT:
        if (isFirstAttempt) {
          toast.warning('Tentando com GPS...', {
            description: 'A localização rápida falhou. Aguarde um momento.',
            duration: 3000,
          });
          setTimeout(() => handleUseCurrentLocation(), 500);
        } else {
          toast.error('Tempo esgotado', {
            description:
              'Não foi possível obter sua localização. Verifique se o GPS está ativo ou use a busca manual.',
            duration: 6000,
          });
          geolocationAttempt.current = 0;
        }
        break;

      default:
        toast.error('Erro ao obter localização', {
          description: 'Use a busca manual para encontrar distribuidores próximos.',
          duration: 5000,
        });
        geolocationAttempt.current = 0;
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada', {
        description: 'Seu navegador não suporta geolocalização. Use a busca manual.',
      });
      return;
    }

    geolocationAttempt.current += 1;
    const isFirstAttempt = geolocationAttempt.current === 1;

    setIsLoading(true);

    const loadingToast = toast.loading(
      isFirstAttempt ? 'Obtendo sua localização...' : 'Tentando novamente com GPS...',
      {
        description: isFirstAttempt
          ? 'Usando localização rápida'
          : 'Aguarde enquanto localizamos você',
      },
    );

    try {
      const position = await requestGeolocation(!isFirstAttempt);
      const { latitude, longitude, accuracy } = position.coords;

      toast.dismiss(loadingToast);
      toast.success('Localização obtida!', {
        description: `Precisão: ~${Math.round(accuracy)}m`,
        duration: 3000,
      });

      resetSearchState();
      handleRadiusFilterAndSort(latitude, longitude);
      setIsLoading(false);
      geolocationAttempt.current = 0;
    } catch (error) {
      toast.dismiss(loadingToast);
      setIsLoading(false);

      if (error instanceof GeolocationPositionError) {
        handleGeolocationError(error, isFirstAttempt);
      } else {
        toast.error('Erro desconhecido', {
          description: 'Use a busca manual para encontrar distribuidores.',
        });
      }
    }
  };

  const handlePlaceSelect = (place: google.maps.places.Place | null) => {
    if (!place?.location || !map) return;

    const searchLat = place.location.lat();
    const searchLng = place.location.lng();

    resetSearchState();
    handleRadiusFilterAndSort(searchLat, searchLng);
  };

  const handleReset = () => {
    resetSearchState();
    map?.panTo(defaultPosition);
    map?.setZoom(16);
    geolocationAttempt.current = 0;
    setIsInitialState(true);
  };

  return {
    handleCardClick,
    handleUseCurrentLocation,
    handlePlaceSelect,
    handleReset,
    isSearchLoading,
    isInitialState,
  };
}
