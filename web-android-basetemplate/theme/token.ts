// theme/tokens.ts

export const tokens = {
  colors: {
    primary: '#6366F1',
    secondary: '#F8FAFC',
    accent: '#22C55E',
    success: '#22C55E',

    background: '#F8FAFC',
    surface: '#FFFFFF',

    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textLight: '#FFFFFF',

    border: '#E2E8F0',
    error: '#EF4444',
    overlay: 'rgba(15, 23, 42, 0.75)',

    teams: {
      whiteTeam: '#FFFFFF',
      blueTeam: '#1D4ED8',
    },

   
    actions: {
      saveBg: '#DCFCE7',
      saveText: '#15803D',
      deleteBg: '#FEF2F2',
      exportBg: '#16A34A',
      disabledBg: '#94A3B8',
    },

    matchScreen: {
      headerColor: '#0F172A',
      shade1: '#f7e11e', 
      PlayerColumn: '#6892f5',
      sidePanel: '#9caacc',
      sidePanel1: '#b1b1b1',
      courtColor: {
        region1: '#6ce439',
        region2: '#d9e854',
        region3: '#e84837',
      },
     
      scoreboard: {
        border: '#334155',
        bg: '#0F172A',
        headerBg: '#1E293B',
        headerText: '#94A3B8',
        teamA: '#22C55E',
        teamB: '#6366F1',
      }
    }
  },

  typography: {
    fontFamily: 'System',

    sizes: {
      h1: 28,
      h2: 22,
      h3: 18,
      body: 16,
      scoreHUD: 26,         // Large scores in HUD center
      playerNumber: 15,
      small: 14,
      tableText: 13,        
      badge: 12,
      cooldownTimer: 11,
      inputMini: 11,        
      caption: 12,
      miniLabel: 10,        // Mini sub labels like HOME/AWAY/Scoreboard
      tableCell: 9,         // Scoreboard grid dimensions
    },

    weights: {
      regular: '400',
      medium: '600',
      bold: '700',
      heavy: '800',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 16,
    round: 9999,
  },

  layout: {
    sidePanelWidth: 100,
    actionButtonWidth: 85,
    actionButtonHeight: 50,
    dividerHeight: 1,
    flexFull: 1,
    elevationMultiplier: 2.5,

    // Match Screen Header 
    header: {
      height: 90,
      actionBlockWidth: 160,
      actionBtnHeight: 38,
      actionGap: 6,
      hudContainerHeight: 64,
      hudTimeMinWidth: 70,
      hudTimeFontSize: 13,
      hudCenterGap: 4,
      scoreboardWidth: 155,
      scoreboardRowHeight: 19,
      scoreboardHeaderWidth: 52,
    },

    popupCard: {
      width: 230,
      subActionHeight: 36,
      confirmButtonHeight: 38,
      borderWidth: 1,
      selectedBorderWidth: 1.5,
      disabledOpacity: 0.4,
    },

    playerBadge: {
      containerWidth: 48,  
      buttonSize: 37,      
      stackRowGap: 1,      
      cooldownSpacing: 1,  
      activeOpacity: 1,
      disabledOpacity: 0.75,
    },

    logModal: {
      containerMaxWidth: 920,
      containerHeight: 530,
      headerHeight: 60,
      tableHeaderHeight: 46,
      rowHeight: 56,
      inputHeight: 36,
      actionBtnMinWidth: 70,
      exportBtnMinWidth: 130,
      exportBtnPaddingOffset: 4,
    }
  },

  shadow: {
    light: {
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    medium: {
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },
  },
};