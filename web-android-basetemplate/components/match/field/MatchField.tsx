import React from 'react';

import {
  View,
} from 'react-native';

import { useTheme } from '../../../theme/themeContext';


// export default function MatchField({ }) {

//   const theme = useTheme();


//   return (

//     <View style={{
//       flex: 4,
//       flexDirection: 'row'
//     }}>
//       <View style={{
//         backgroundColor: theme.colors.matchScreen.courtColor.region1,
//         flex: 1,
//       }}></View>
//       <View style={{
//         backgroundColor: theme.colors.matchScreen.courtColor.region2,
//         flex: 2,
//       }}>

//       </View>
//       <View style={{
//         backgroundColor: theme.colors.matchScreen.courtColor.region3,
//         flex: 3,
//       }}></View>





//     </View>
//   );
// }

export default function MatchField({ side }: { side?: 'left' | 'right' }) {
  const theme = useTheme();

  const regions =
    side === 'right'
      ? [
          { color: theme.colors.matchScreen.courtColor.region1, flex: 3 },
          { color: theme.colors.matchScreen.courtColor.region2, flex: 2 },
          { color: theme.colors.matchScreen.courtColor.region3, flex: 1 },
        ]
      : [
          { color: theme.colors.matchScreen.courtColor.region3, flex: 1 },
          { color: theme.colors.matchScreen.courtColor.region2, flex: 2 },
          { color: theme.colors.matchScreen.courtColor.region1, flex: 3 },
        ];

  return (
    <View style={{ flex: 4, flexDirection: 'row' }}>
      {regions.map((r, i) => (
        <View
          key={i}
          style={{
            backgroundColor: r.color,
            flex: r.flex,
          }}
        />
      ))}
    </View>
  );
}

