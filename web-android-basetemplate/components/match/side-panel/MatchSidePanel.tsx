// // import React from 'react';

// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// // } from 'react-native';

// // import { useTheme } from '../../../theme/themeContext';

// // import MatchSideAction from './MatchSideAction';

// // interface Props {
// //   teamName: string;

// //   activeAction?: string | null;

// //   onSelectAction: (
// //     action: string
// //   ) => void;
// // }

// // export default function MatchSidePanel({
// //   teamName,
// //   activeAction,
// //   onSelectAction,
// // }: Props) {

// //   const theme = useTheme();

// //   const styles = createStyles(theme);

// //   const actions = [
// //     {
// //       label: 'Attack',
// //       icon: 'flash-outline',
// //     },
// //     {
// //       label: 'Defence',
// //       icon: 'shield-outline',
// //     },
// //     {
// //       label: 'Penalty',
// //       icon: 'warning-outline',
// //     },
// //     {
// //       label: 'Timeout',
// //       icon: 'timer-outline',
// //     },
// //   ];

// //   return (

// //     <View style={styles.container}>

// //       {/* TEAM TITLE */}

// //       <Text style={styles.teamName}>
// //         {teamName}
// //       </Text>

// //       {/* ACTIONS */}

// //       <View style={styles.actionList}>

// //         {actions.map((action) => (

// //           <MatchSideAction
// //             key={action.label}
// //             title={action.label}
// //             icon={action.icon}
// //             active={
// //               activeAction === action.label
// //             }
// //             onPress={() =>
// //               onSelectAction(action.label)
// //             }
// //           />

// //         ))}

// //       </View>

// //     </View>
// //   );
// // }

// // const createStyles = (theme: any) =>
// //   StyleSheet.create({

// //     container: {
// //       width: 110,
// //       height: '100%',

// //       paddingVertical: theme.spacing.lg,
// //       paddingHorizontal: theme.spacing.sm,

// //       backgroundColor: theme.colors.background,

// //       justifyContent: 'center',
// //       alignItems: 'center',
// //     },

// //     teamName: {
// //       fontSize: 16,
// //       fontWeight: '700',

// //       marginBottom: theme.spacing.lg,

// //       color: theme.colors.textPrimary,
// //     },

// //     actionList: {
// //       width: '100%',

// //       gap: theme.spacing.sm,
// //     },

// //   });



// import React from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
// } from 'react-native';

// import { useTheme } from '../../../theme/themeContext';

// import Button from '../../ui/Button';

// interface Props {
//   teamName: string;

//   activeAction?: string | null;

//   onSelectAction: (
//     action: string
//   ) => void;
// }

// export default function MatchSidePanel() {

//   const theme = useTheme();


//  const actions = [
//   {
//     label: 'Goals',
//     icon: 'football-outline',
//   },
//   {
//     label: 'Shots',
//     icon: 'aperture-outline', // or 'radio-button-on-outline'
//   },
//   {
//     label: 'Fouls',
//     icon: 'alert-circle-outline',
//   },
//   {
//     label: 'Penalty',
//     icon: 'warning-outline',
//   },
//   {
//     label: 'Bench',
//     icon: 'people-outline',
//   },
//   {
//     label: 'Other',
//     icon: 'ellipsis-horizontal-outline',
//   },
// ];

//   return (
// <View
//   style={{
//     flex: 1,
//     backgroundColor: theme.colors.matchScreen.sidePanel,
//   }}
// >

//  {/* TOP 30% */}
// <View
//   style={{
//     flex: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   }}
// >
//   <Text
//     style={{
//       color: theme.colors.textPrimary,
     
//     }}
//   >
//     Team
//   </Text>
// </View>

//   {/* BOTTOM 70% */}
//   <View style={{ flex: 8 }}>
//     <View
//       style={{
//         width: '100%',
//         alignItems: 'center',
//         gap: 12,
//       }}
//     >
//       {actions.map((action) => (
//         <View
//           key={action.label}
//           style={{
//             width: '80%', // 👈 controls uniform button width
//           }}
//         >
//           <Button
//             title={action.label}
//             icon={action.icon}
//             size="sm"
//             style={{
//               width: '100%',
//             }}
//           />
//         </View>
//       ))}
//     </View>
//   </View>

// </View>
//   );
// }
 // MatchSidePanel.tsx

import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Button from '../../ui/Button'; 
import ActionPopupCard from './ActionPopupCard'; 
import { useMatch } from '../layout/MatchContext'; 

interface MatchSidePanelProps {
  side: 'left' | 'right';
}

export default function MatchSidePanel({ side }: MatchSidePanelProps) {
  const theme = useTheme();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { selectedPlayer } = useMatch(); 

  const actions = [
    { label: 'Goals', icon: 'football-outline' },
    { label: 'Shots', icon: 'aperture-outline' },
    { label: 'Fouls', icon: 'alert-circle-outline' },
    { label: 'Penalty', icon: 'warning-outline' },
    { label: 'Card', icon: 'people-outline' },
    { label: 'Other', icon: 'ellipsis-horizontal-outline' },
    { label: 'Coach', icon: 'person-circle-outline' },
  ];
  

  const isLeft = side === 'left';
  const buttonTextColor = isLeft ? theme.colors.primary : theme.colors.secondary;
  const buttonBorderColor = isLeft ? theme.colors.primary : theme.colors.secondary;
  const buttonBgColor = isLeft ? theme.colors.secondary : theme.colors.primary;

  const handleActionPress = (actionLabel: string) => {
    // Escape hatch bypass constraint: Skip selectedPlayer validation rules if selecting Coach actions
    if (actionLabel !== 'Coach' && (!selectedPlayer || selectedPlayer.side !== side)) {
      Alert.alert(
        "Selection Required", 
        `Please select a player from Team ${isLeft ? 'A' : 'B'} before tracking an action.`
      );
      return;
    }
    setSelectedAction(selectedAction === actionLabel ? null : actionLabel);
  };

  // Composite gap utility matching token system configurations cleanly inline
  const compositeGapValue = theme.spacing.sm + theme.spacing.xs;

  return (
    <View style={{
      flex: theme.layout.flexFull, 
      maxWidth: theme.layout.sidePanelWidth, 
      position: 'relative', 
      overflow: 'visible', 
      zIndex: 10, 
      elevation: theme.shadow.medium.elevation * theme.layout.elevationMultiplier,
    }}> 
      <View style={{
        flex: theme.layout.flexFull, 
        backgroundColor: theme.colors.matchScreen.sidePanel1, 
        overflow: 'visible',
      }}>
        <View style={{
          flex: theme.layout.flexFull, 
          justifyContent: 'center', 
          alignItems: 'center',
        }}>
          <Text style={{
            color: theme.colors.textPrimary, 
            fontSize: theme.typography.sizes.body, 
            fontWeight: theme.typography.weights.bold as '700',
          }}>Team</Text>
        </View>

        <View style={{
          height: theme.layout.dividerHeight, 
          backgroundColor: theme.colors.border, 
          marginHorizontal: compositeGapValue,
        }} />

        <View style={{
          flex: 9, 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          paddingTop: theme.spacing.xl, 
          overflow: 'visible',
        }}>
          <View style={{
            width: '100%', 
            alignItems: 'center', 
            gap: compositeGapValue, 
            overflow: 'visible',
          }}>
            {actions.map((action) => (
              <Button
                key={action.label}
                title={action.label}
                icon={action.icon}
                variant="outline"
                textColor={buttonTextColor}
                borderColor={buttonBorderColor}
                backgroundColor={buttonBgColor}
                onPress={() => handleActionPress(action.label)}
                style={{
                  width: theme.layout.actionButtonWidth, 
                  height: theme.layout.actionButtonHeight, 
                  flexDirection: 'column', 
                  gap: theme.spacing.xs,
                }}
              />
            ))}
          </View>
        </View>
      </View>

      <ActionPopupCard 
        selectedAction={selectedAction} 
        onClose={() => setSelectedAction(null)} 
        side={side} 
      />
    </View>
  );
}