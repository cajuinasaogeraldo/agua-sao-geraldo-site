import '@googlemaps/extended-component-library/react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  onReset?: () => void;
}

export const AutoCompleteSearchBox = ({ onPlaceSelect, onReset }: Props) => {
  useMapsLibrary('places');
  const ref = useRef<google.maps.places.PlaceAutocompleteElement>(null);
  const [disableClearButton, setDisableClearButton] = useState<boolean>(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // const handleClick = (ev: MouseEvent) => {
    //   // Cache rect para evitar múltiplas leituras
    //   requestAnimationFrame(() => {
    //     const rect = el.getBoundingClientRect();
    //     const x = ev.clientX - rect.left;
    //     const y = ev.clientY - rect.top;

    //     // margem clicável do lado direito (ex: 40px)
    //     const clickableWidth = 40;

    //     // se o clique for no último pedacinho do input → "clear"
    //     // if (x >= rect.width - clickableWidth && y >= 0 && y <= rect.height) {
    //     //   onPlaceSelect(null);
    //     //   onReset?.();
    //     // }
    //   });
    // };

    const handleInput = () => {
      setDisableClearButton(el.value === '');
    };

    el.addEventListener('input', handleInput);
    // Inicializa estado
    setDisableClearButton(el.value === '');

    return () => {
      el.removeEventListener('input', handleInput);
    };
  }, [onReset, onPlaceSelect]);

  async function handlePlaceSelect(place: google.maps.places.Place) {
    await place.fetchFields({
      fields: ['displayName', 'formattedAddress', 'location', 'viewport'],
    });
    onPlaceSelect(place);
  }

  function handleReset() {
    if (ref.current) ref.current.value = '';
    onPlaceSelect(null);
    onReset?.();
  }

  return (
    <div className="relative w-full flex">
      <gmp-place-autocomplete
        ref={ref}
        includedRegionCodes={['br']}
        className="w-full rounded-lg border border-black bg-white text-black scheme-light shadow-sm focus:ring-[1px] focus:ring-blue-400/90"
        ongmp-select={(ev: any) => {
          void handlePlaceSelect(ev.placePrediction.toPlace());
        }}
        ongmp-placeselect={(ev: any) => {
          void handlePlaceSelect(ev.place);
        }}
      />
      <X
        onClick={handleReset}
        color="#000"
        size={30}
        className={clsx(
          'absolute right-2 top-1/2 -translate-y-1/2 border border-black rounded-xl p-1',
          'bg-white hover:shadow-[0_0_0_7px_theme(colors.zinc.200)] transition-shadow cursor-pointer',
          {
            'pointer-events-none hidden': disableClearButton,
          },
        )}
      />
    </div>
  );
};
