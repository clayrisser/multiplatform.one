/*
 * File: /src/index.ts
 * Project: @multiplatform.one/components
 * File Created: 21-06-2024 10:17:52
 * Author: Pavan Kumar
 * File Created: 21-06-2024 12:06:23
 * Author: Lavanya Katari
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export * from './ErrorBoundary';
export * from './code';
export * from './forms';
export * from './helpers';
export * from './hooks';
export * from './images';
export * from './layouts';
export * from './mdx';
export * from './organize';
export * from './panels';
export * from './table';
export * from './tints';
export {
  ACTIONS,
  Accordion,
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionSingleProps,
  AccordionTriggerProps,
  ActionTypes,
  Adapt,
  AdaptContents,
  AdaptParentContext,
  AdaptProps,
  AddUpdatePortalAction,
  AlertDialog,
  AlertDialogAction,
  AlertDialogActionProps,
  AlertDialogCancel,
  AlertDialogCancelProps,
  AlertDialogContent,
  AlertDialogContentProps,
  AlertDialogDescription,
  AlertDialogDescriptionProps,
  AlertDialogOverlay,
  AlertDialogOverlayProps,
  AlertDialogPortal,
  AlertDialogPortalProps,
  AlertDialogProps,
  AlertDialogTitle,
  AlertDialogTitleProps,
  AlertDialogTrigger,
  AlertDialogTriggerProps,
  Anchor,
  AnchorExtraProps,
  AnchorProps,
  AnimatePresence,
  AnimatePresenceProps,
  AnimationKeys,
  Article,
  Aside,
  Avatar,
  AvatarFallback,
  AvatarFallbackFrame,
  AvatarFallbackProps,
  AvatarFrame,
  AvatarImage,
  AvatarImageProps,
  AvatarProps,
  Axis,
  Box,
  Button,
  ButtonContext,
  ButtonFrame,
  ButtonIcon,
  ButtonNestingContext,
  ButtonProps,
  ButtonText,
  Card,
  CardBackground,
  CardFooter,
  CardFooterProps,
  CardFrame,
  CardHeader,
  CardHeaderProps,
  CardProps,
  Checkbox,
  CheckboxContext,
  CheckboxFrame,
  CheckboxIndicatorFrame,
  CheckboxIndicatorProps,
  CheckboxProps,
  CheckboxStyledContext,
  CheckedState,
  Circle,
  CircleProps,
  ColorProp,
  ColorTokens,
  ComponentContext,
  Configuration,
  CreateScope,
  CreateTamaguiConfig,
  CreateTamaguiProps,
  Dialog,
  DialogClose,
  DialogCloseExtraProps,
  DialogCloseProps,
  DialogContent,
  DialogContentProps,
  DialogDescription,
  DialogDescriptionProps,
  DialogHandle,
  DialogOverlay,
  DialogOverlayFrame,
  DialogOverlayProps,
  DialogPortal,
  DialogPortalFrame,
  DialogPortalProps,
  DialogProps,
  DialogSheetContents,
  DialogTitle,
  DialogTitleProps,
  DialogTrigger,
  DialogTriggerProps,
  DialogWarningProvider,
  EmitterSubscriber,
  EnsureFlexed,
  EventHandler,
  ExplicitNativePlatform,
  Fieldset,
  FieldsetProps,
  FontColorTokens,
  FontLanguages,
  FontLetterSpacingTokens,
  FontSizeTokens,
  FontStyleTokens,
  FontTokens,
  FontTransformTokens,
  FontWeightTokens,
  Footer,
  Form,
  FormFrame,
  FormProvider,
  FormTrigger,
  ForwardSelectContext,
  Frame,
  GenericFont,
  GenericStackVariants,
  GenericTamaguiConfig,
  GenericTextVariants,
  GetAnimationKeys,
  GetProps,
  GetRef,
  Group,
  GroupFrame,
  GroupItemProps,
  GroupNames,
  GroupProps,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Handle,
  Header,
  Heading,
  HeadingProps,
  INITIAL_STATE,
  Image,
  ImageProps,
  Input,
  InputExtraProps,
  InputFrame,
  InputFrameProps,
  InputProps,
  Label,
  LabelFrame,
  LabelProps,
  ListItem,
  ListItemExtraProps,
  ListItemFrame,
  ListItemProps,
  ListItemSubtitle,
  ListItemText,
  ListItemTitle,
  Longhands,
  Main,
  Media,
  MediaPropKeys,
  MediaQueries,
  MediaQueryState,
  MediaStyleObject,
  MutateOneThemeProps,
  NativePlatform,
  NativeValue,
  Nav,
  Overlay,
  Paragraph,
  ParagraphProps,
  Popover,
  PopoverAnchor,
  PopoverAnchorProps,
  PopoverArrow,
  PopoverArrowProps,
  PopoverClose,
  PopoverCloseProps,
  PopoverContent,
  PopoverContentImplProps,
  PopoverContentProps,
  PopoverContentTypeProps,
  PopoverContext,
  PopoverProps,
  PopoverTrigger,
  PopoverTriggerProps,
  Popper,
  PopperAnchor,
  PopperAnchorProps,
  PopperArrow,
  PopperArrowExtraProps,
  PopperArrowProps,
  PopperContent,
  PopperContentFrame,
  PopperContentProps,
  PopperContext,
  PopperContextValue,
  PopperProps,
  PopperProvider,
  PopperSetupOptions,
  Portal,
  PortalHost,
  PortalHostProps,
  PortalItem,
  PortalItemProps,
  PortalProps,
  PortalProvider,
  PortalProviderProps,
  PositionChangeHandler,
  PresenceChild,
  PresenceContext,
  Progress,
  ProgressExtraProps,
  ProgressFrame,
  ProgressIndicator,
  ProgressIndicatorFrame,
  ProgressIndicatorProps,
  ProgressProps,
  RadioGroup,
  RadioGroupFrame,
  RadioGroupIndicatorFrame,
  RadioGroupItemFrame,
  RadioGroupItemProps,
  RadioGroupProps,
  RadioGroupStyledContext,
  RadiusTokens,
  Range,
  RegisterHostAction,
  RemovePortalAction,
  RemoveScrollProps,
  ResetPresence,
  Scope,
  ScopedProps,
  ScrollBridge,
  ScrollView,
  ScrollViewProps,
  Section,
  Select,
  SelectContentProps,
  SelectContextValue,
  SelectDirection,
  SelectGroupFrame,
  SelectIcon,
  SelectImplProps,
  SelectItemExtraProps,
  SelectItemParentContextValue,
  SelectItemParentProvider,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectProvider,
  SelectScopedProps,
  SelectScrollButtonImplProps,
  SelectScrollButtonProps,
  SelectSeparator,
  SelectTriggerProps,
  SelectValueExtraProps,
  SelectViewportExtraProps,
  SelectViewportProps,
  Separator,
  Sheet,
  SheetController,
  SheetControllerContext,
  SheetControllerContextValue,
  SheetProps,
  SheetScopedProps,
  ShorthandTextStyleProps,
  ShorthandViewStyleProps,
  Shorthands,
  SizableStack,
  SizableStackProps,
  SizableText,
  SizableTextProps,
  SizeTokens,
  Slider,
  SliderFrame,
  SliderHorizontalProps,
  SliderProps,
  SliderThumb,
  SliderThumbExtraProps,
  SliderThumbFrame,
  SliderThumbProps,
  SliderTrack,
  SliderTrackActive,
  SliderTrackActiveFrame,
  SliderTrackActiveProps,
  SliderTrackFrame,
  SliderTrackProps,
  SliderVerticalProps,
  SnapPointsMode,
  SpaceTokens,
  Spacer,
  SpacerProps,
  SpecificTokens,
  Spinner,
  SpinnerProps,
  Square,
  SquareProps,
  Stack,
  StackNonStyleProps,
  StackProps,
  StaticConfig,
  StyleObject,
  Styleable,
  Switch,
  SwitchContext,
  SwitchExtraProps,
  SwitchFrame,
  SwitchProps,
  SwitchStyledContext,
  SwitchThumb,
  SwitchThumbProps,
  TabLayout,
  Tabs,
  TabsContentProps,
  TabsListProps,
  TabsProps,
  TabsTabProps,
  TamaguiBaseTheme,
  TamaguiBuildOptions,
  TamaguiComponent,
  TamaguiConfig,
  TamaguiCustomConfig,
  TamaguiElement,
  TamaguiInternalConfig,
  TamaguiProvider,
  TamaguiProviderProps,
  TamaguiSettings,
  TamaguiTextElement,
  Text,
  TextArea,
  TextAreaFrame,
  TextAreaProps,
  TextContextStyles,
  TextNonStyleProps,
  TextParentStyles,
  TextProps,
  TextStyle,
  Theme,
  ThemeKeys,
  ThemeName,
  ThemeParsed,
  ThemeProps,
  ThemeTokens,
  ThemeValueFallback,
  ThemeableStack,
  ThemeableStackProps,
  Themes,
  Thumb,
  ToggleGroup,
  ToggleGroupItemProps,
  ToggleGroupMultipleProps,
  ToggleGroupProps,
  ToggleGroupSingleProps,
  Token,
  Tokens,
  Tooltip,
  TooltipGroup,
  TooltipProps,
  TooltipSimple,
  TooltipSimpleProps,
  Track,
  TypeOverride,
  UnregisterHostAction,
  Unspaced,
  Variable,
  VariantLabels,
  VariantSpreadExtras,
  VariantSpreadFunction,
  View,
  ViewProps,
  ViewStyle,
  VisuallyHidden,
  XGroup,
  XStack,
  YGroup,
  YStack,
  YStackProps,
  ZIndexTokens,
  ZStack,
  themeable,
  FontLanguage,
  FontLineHeightTokens,
  FormProps,
  FormTriggerProps,
  XStackProps,
  ZStackProps,
  addTheme,
  clamp,
  composeEventHandlers,
  composeRefs,
  concatClassName,
  configureInitialWindowDimensions,
  createAlertDialogScope,
  createAvatarScope,
  createCheckbox,
  createComponent,
  createContext,
  createContextScope,
  createDialogScope,
  createFont,
  createMedia,
  createProgressScope,
  createRadioGroup,
  createSelectContext,
  createSelectItemParentContext,
  createSelectItemParentScope,
  createSelectScope,
  createSheet,
  createSheetScope,
  createShorthands,
  createStyledContext,
  createSwitch,
  createTamagui,
  createTokens,
  createVariable,
  debounce,
  defaultStyles,
  fullscreenStyle,
  getConfig,
  getFontSize,
  getFontSizeToken,
  getFontSizeVariable,
  getMedia,
  getShapeSize,
  getStylesAtomic,
  getThemes,
  getToken,
  getTokenValue,
  getTokens,
  getVariable,
  getVariableName,
  getVariableValue,
  insertFont,
  isChrome,
  isClient,
  isPresent,
  isServer,
  isServerSide,
  isTamaguiComponent,
  isTamaguiElement,
  isTouchable,
  isVariable,
  isWeb,
  isWebTouchable,
  matchMedia,
  mediaObjectToString,
  mediaQueryConfig,
  mediaState,
  mutateThemes,
  prevent,
  replaceTheme,
  setRef,
  setupDev,
  setupNativeSheet,
  setupPopper,
  shouldRenderNativePlatform,
  simpleHash,
  spacedChildren,
  stylePropsAll,
  stylePropsFont,
  stylePropsText,
  stylePropsTextOnly,
  stylePropsTransform,
  stylePropsUnitless,
  stylePropsView,
  styled,
  themeableVariants,
  tokenCategories,
  updateTheme,
  useAdaptParent,
  useComposedRefs,
  useConfiguration,
  useControllableState,
  useCurrentColor,
  useDebounce,
  useDebounceValue,
  useDidFinishSSR,
  useEvent,
  useFloatingContext,
  useForceUpdate,
  useFormContext,
  useGet,
  useGetThemedIcon,
  useGroupItem,
  useInputProps,
  useIsPresent,
  useIsTouchDevice,
  useIsomorphicLayoutEffect,
  useLabelContext,
  useListItem,
  useMedia,
  usePopoverContext,
  usePopperContext,
  usePortal,
  usePresence,
  useProps,
  usePropsAndStyle,
  useSelectContext,
  useSelectItemParentContext,
  useSheet,
  useSheetController,
  useStyle,
  useTabsContext,
  useTheme,
  useThemeName,
  useWindowDimensions,
  validPseudoKeys,
  validStyles,
  variableToString,
  withStaticProperties,
  wrapChildrenInText,
} from 'tamagui';
export { Toast } from '@tamagui/toast';

export {
  AArrowDown,
  AArrowUp,
  ALargeSmall,
  Accessibility,
  Activity,
  ActivitySquare,
  AirVent,
  Airplay,
  AlarmCheck,
  AlarmClock,
  AlarmClockCheck,
  AlarmClockMinus,
  AlarmClockOff,
  AlarmClockPlus,
  AlarmMinus,
  AlarmPlus,
  AlarmSmoke,
  Album,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  AlignCenter,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalDistributeStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  AlignVerticalDistributeEnd,
  AlignVerticalDistributeStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalSpaceAround,
  AlignVerticalSpaceBetween,
  Ampersand,
  Ampersands,
  Anchor as AnchorIcon,
  Angry,
  Annoyed,
  Antenna,
  Anvil,
  Aperture,
  AppWindow,
  Apple,
  Archive,
  ArchiveRestore,
  ArchiveX,
  AreaChart,
  Armchair,
  ArrowBigDown,
  ArrowBigDownDash,
  ArrowBigLeft,
  ArrowBigLeftDash,
  ArrowBigRight,
  ArrowBigRightDash,
  ArrowBigUp,
  ArrowBigUpDash,
  ArrowDown,
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownCircle,
  ArrowDownFromLine,
  ArrowDownLeft,
  ArrowDownLeftFromCircle,
  ArrowDownLeftFromSquare,
  ArrowDownLeftSquare,
  ArrowDownNarrowWide,
  ArrowDownRight,
  ArrowDownRightFromCircle,
  ArrowDownRightFromSquare,
  ArrowDownRightSquare,
  ArrowDownSquare,
  ArrowDownToDot,
  ArrowDownToLine,
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowDownZA,
  ArrowLeft,
  ArrowLeftCircle,
  ArrowLeftFromLine,
  ArrowLeftRight,
  ArrowLeftSquare,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightCircle,
  ArrowRightFromLine,
  ArrowRightLeft,
  ArrowRightSquare,
  ArrowRightToLine,
  ArrowUp,
  ArrowUp01,
  ArrowUp10,
  ArrowUpAZ,
  ArrowUpCircle,
  ArrowUpDown,
  ArrowUpFromDot,
  ArrowUpFromLine,
  ArrowUpLeft,
  ArrowUpLeftFromCircle,
  ArrowUpLeftFromSquare,
  ArrowUpLeftSquare,
  ArrowUpNarrowWide,
  ArrowUpRight,
  ArrowUpRightFromCircle,
  ArrowUpRightFromSquare,
  ArrowUpRightSquare,
  ArrowUpSquare,
  ArrowUpToLine,
  ArrowUpWideNarrow,
  ArrowUpZA,
  ArrowsUpFromLine,
  Asterisk,
  AsteriskSquare,
  AtSign,
  Atom,
  AudioLines,
  AudioWaveform,
  Award,
  Axe,
  Axis3d,
  Baby,
  Backpack,
  Badge,
  BadgeAlert,
  BadgeCent,
  BadgeCheck,
  BadgeDollarSign,
  BadgeEuro,
  BadgeHelp,
  BadgeIndianRupee,
  BadgeInfo,
  BadgeJapaneseYen,
  BadgeMinus,
  BadgePercent,
  BadgePlus,
  BadgePoundSterling,
  BadgeRussianRuble,
  BadgeSwissFranc,
  BadgeX,
  BaggageClaim,
  Ban,
  Banana,
  Banknote,
  BarChart,
  BarChart2,
  BarChart3,
  BarChart4,
  BarChartBig,
  BarChartHorizontal,
  BarChartHorizontalBig,
  Barcode,
  Baseline,
  Bath,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Beaker,
  Bean,
  BeanOff,
  Bed,
  BedDouble,
  BedSingle,
  Beef,
  Beer,
  Bell,
  BellDot,
  BellElectric,
  BellMinus,
  BellOff,
  BellPlus,
  BellRing,
  BetweenHorizontalEnd,
  BetweenHorizontalStart,
  BetweenVerticalEnd,
  BetweenVerticalStart,
  Bike,
  Binary,
  Biohazard,
  Bird,
  Bitcoin,
  Blend,
  Blinds,
  Blocks,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  BluetoothSearching,
  Bold,
  Bolt,
  Bomb,
  Bone,
  Book,
  BookA,
  BookAudio,
  BookCheck,
  BookCopy,
  BookDashed,
  BookDown,
  BookHeadphones,
  BookHeart,
  BookImage,
  BookKey,
  BookLock,
  BookMarked,
  BookMinus,
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  BookPlus,
  BookTemplate,
  BookText,
  BookType,
  BookUp,
  BookUp2,
  BookUser,
  BookX,
  Bookmark,
  BookmarkCheck,
  BookmarkMinus,
  BookmarkPlus,
  BookmarkX,
  BoomBox,
  Bot,
  Box as BoxIcon,
  BoxSelect,
  Boxes,
  Braces,
  Brackets,
  Brain,
  BrainCircuit,
  BrainCog,
  BrickWall,
  Briefcase,
  BringToFront,
  Brush,
  Bug,
  BugOff,
  BugPlay,
  Building,
  Building2,
  Bus,
  BusFront,
  Cable,
  CableCar,
  Cake,
  CakeSlice,
  Calculator,
  Calendar,
  CalendarCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarHeart,
  CalendarMinus,
  CalendarOff,
  CalendarPlus,
  CalendarRange,
  CalendarSearch,
  CalendarX,
  CalendarX2,
  Camera,
  CameraOff,
  CandlestickChart,
  Candy,
  CandyCane,
  CandyOff,
  Car,
  CarFront,
  CarTaxiFront,
  Caravan,
  Carrot,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  CassetteTape,
  Cast,
  Castle,
  Cat,
  Cctv,
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  CheckSquare2,
  ChefHat,
  Cherry,
  ChevronDown,
  ChevronDownCircle,
  ChevronDownSquare,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronLeftCircle,
  ChevronLeftSquare,
  ChevronRight,
  ChevronRightCircle,
  ChevronRightSquare,
  ChevronUp,
  ChevronUpCircle,
  ChevronUpSquare,
  ChevronsDown,
  ChevronsDownUp,
  ChevronsLeft,
  ChevronsLeftRight,
  ChevronsRight,
  ChevronsRightLeft,
  ChevronsUp,
  ChevronsUpDown,
  Chrome,
  Church,
  Cigarette,
  CigaretteOff,
  Circle as CircleIcon,
  CircleDashed,
  CircleDollarSign,
  CircleDot,
  CircleDotDashed,
  CircleEllipsis,
  CircleEqual,
  CircleOff,
  CircleSlash,
  CircleSlash2,
  CircleUser,
  CircleUserRound,
  CircuitBoard,
  Citrus,
  Clapperboard,
  Clipboard,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardEdit,
  ClipboardList,
  ClipboardPaste,
  ClipboardPen,
  ClipboardPenLine,
  ClipboardSignature,
  ClipboardType,
  ClipboardX,
  Clock,
  Clock1,
  Clock10,
  Clock11,
  Clock12,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Cloud,
  CloudCog,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudOff,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Cloudy,
  Clover,
  Club,
  Code,
  Code2,
  CodeSquare,
  Codepen,
  Codesandbox,
  Coffee,
  Cog,
  Coins,
  Columns,
  Columns2,
  Columns3,
  Columns4,
  Combine,
  Command,
  Compass,
  Component,
  Computer,
  ConciergeBell,
  Cone,
  Construction,
  Contact,
  Contact2,
  Container,
  Contrast,
  Cookie,
  CookingPot,
  Copy,
  CopyCheck,
  CopyMinus,
  CopyPlus,
  CopySlash,
  CopyX,
  Copyleft,
  Copyright,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftDown,
  CornerLeftUp,
  CornerRightDown,
  CornerRightUp,
  CornerUpLeft,
  CornerUpRight,
  Cpu,
  CreativeCommons,
  CreditCard,
  Croissant,
  Crop,
  Cross,
  Crosshair,
  Crown,
  Cuboid,
  CupSoda,
  Currency,
  Cylinder,
  Database,
  DatabaseBackup,
  DatabaseZap,
  Delete,
  Dessert,
  Diameter,
  Diamond,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Dices,
  Diff,
  Disc,
  Disc2,
  Disc3,
  DiscAlbum,
  Divide,
  DivideCircle,
  DivideSquare,
  Dna,
  DnaOff,
  Dog,
  DollarSign,
  Donut,
  DoorClosed,
  DoorOpen,
  Dot,
  DotSquare,
  Download,
  DownloadCloud,
  DraftingCompass,
  Drama,
  Dribbble,
  Drill,
  Droplet,
  Droplets,
  Drum,
  Drumstick,
  Dumbbell,
  Ear,
  EarOff,
  Eclipse,
  Edit3,
  Egg,
  EggFried,
  EggOff,
  Equal,
  EqualNot,
  EqualSquare,
  Eraser,
  Euro,
  Expand,
  ExternalLink,
  Eye,
  EyeOff,
  Facebook,
  Factory,
  Fan,
  FastForward,
  Feather,
  Fence,
  FerrisWheel,
  Figma,
  File,
  FileArchive,
  FileAudio,
  FileAudio2,
  FileAxis3d,
  FileBadge,
  FileBadge2,
  FileBarChart,
  FileBarChart2,
  FileBox,
  FileCheck,
  FileCheck2,
  FileClock,
  FileCode,
  FileCode2,
  FileCog,
  FileCog2,
  FileDiff,
  FileDigit,
  FileDown,
  FileEdit,
  FileHeart,
  FileImage,
  FileInput,
  FileJson,
  FileJson2,
  FileKey,
  FileKey2,
  FileLineChart,
  FileLock,
  FileLock2,
  FileMinus,
  FileMinus2,
  FileMusic,
  FileOutput,
  FilePen,
  FilePenLine,
  FilePieChart,
  FilePlus,
  FilePlus2,
  FileQuestion,
  FileScan,
  FileSearch,
  FileSearch2,
  FileSignature,
  FileSliders,
  FileSpreadsheet,
  FileStack,
  FileSymlink,
  FileTerminal,
  FileText,
  FileType,
  FileType2,
  FileUp,
  FileVideo,
  FileVideo2,
  FileVolume,
  FileVolume2,
  FileWarning,
  FileX,
  FileX2,
  Files,
  Film,
  Filter,
  FilterX,
  Fingerprint,
  FireExtinguisher,
  Fish,
  FishOff,
  FishSymbol,
  Flag,
  FlagOff,
  FlagTriangleLeft,
  FlagTriangleRight,
  Flame,
  FlameKindling,
  Flashlight,
  FlashlightOff,
  FlaskConical,
  FlaskConicalOff,
  FlaskRound,
  FlipHorizontal,
  FlipHorizontal2,
  FlipVertical,
  FlipVertical2,
  Flower,
  Flower2,
  Focus,
  FoldHorizontal,
  FoldVertical,
  Folder,
  FolderArchive,
  FolderCheck,
  FolderClock,
  FolderClosed,
  FolderCog,
  FolderDot,
  FolderDown,
  FolderGit,
  FolderGit2,
  FolderHeart,
  FolderInput,
  FolderKanban,
  FolderKey,
  FolderLock,
  FolderMinus,
  FolderOpen,
  FolderOpenDot,
  FolderOutput,
  FolderPen,
  FolderPlus,
  FolderRoot,
  FolderSearch,
  FolderSearch2,
  FolderSymlink,
  FolderSync,
  FolderTree,
  FolderUp,
  FolderX,
  Folders,
  Footprints,
  Forklift,
  FormInput,
  Forward,
  Frame as FrameIcon,
  Framer,
  Frown,
  Fuel,
  Fullscreen,
  FunctionSquare,
  GalleryHorizontal,
  GalleryHorizontalEnd,
  GalleryThumbnails,
  GalleryVertical,
  GalleryVerticalEnd,
  Gamepad,
  Gamepad2,
  GanttChart,
  GanttChartSquare,
  Gauge,
  GaugeCircle,
  Gavel,
  Gem,
  Ghost,
  Gift,
  GitBranch,
  GitBranchPlus,
  GitCommit,
  GitCommitHorizontal,
  GitCommitVertical,
  GitCompare,
  GitCompareArrows,
  GitFork,
  GitGraph,
  GitMerge,
  GitPullRequest,
  GitPullRequestArrow,
  GitPullRequestClosed,
  GitPullRequestCreate,
  GitPullRequestCreateArrow,
  GitPullRequestDraft,
  Github,
  Gitlab,
  GlassWater,
  Glasses,
  Globe,
  Globe2,
  Goal,
  Grab,
  GraduationCap,
  Grape,
  Grid,
  Grid2x2,
  Grid3x3,
  Grip,
  GripHorizontal,
  GripVertical,
  Group as GroupIcon,
  Guitar,
  Hammer,
  Hand,
  HandMetal,
  HardDrive,
  HardDriveDownload,
  HardDriveUpload,
  HardHat,
  Hash,
  Haze,
  HdmiPort,
  Heading as HeadingIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Headphones,
  Heart,
  HeartCrack,
  HeartHandshake,
  HeartOff,
  HeartPulse,
  Heater,
  HelpCircle,
  HelpingHand,
  Hexagon,
  Highlighter,
  History,
  Home,
  Hop,
  HopOff,
  Hotel,
  Hourglass,
  IceCream,
  IceCream2,
  Image as ImageIcon,
  ImageDown,
  ImageMinus,
  ImageOff,
  ImagePlus,
  Import,
  Inbox,
  Indent,
  IndianRupee,
  Infinity,
  Info,
  Inspect,
  InspectionPanel,
  Instagram,
  Italic,
  IterationCcw,
  IterationCw,
  JapaneseYen,
  Joystick,
  Kanban,
  KanbanSquare,
  KanbanSquareDashed,
  Key,
  KeyRound,
  KeySquare,
  Keyboard,
  KeyboardMusic,
  Lamp,
  LampCeiling,
  LampDesk,
  LampFloor,
  LampWallDown,
  LampWallUp,
  LandPlot,
  Landmark,
  Languages,
  Laptop,
  Laptop2,
  Lasso,
  LassoSelect,
  Laugh,
  Layers,
  Layers2,
  Layers3,
  Layout,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  LayoutPanelLeft,
  LayoutPanelTop,
  LayoutTemplate,
  Leaf,
  LeafyGreen,
  Library,
  LibraryBig,
  LibrarySquare,
  LifeBuoy,
  Ligature,
  Lightbulb,
  LightbulbOff,
  LineChart,
  Link,
  Link2,
  Link2Off,
  Linkedin,
  List,
  ListChecks,
  ListCollapse,
  ListEnd,
  ListFilter,
  ListMinus,
  ListMusic,
  ListOrdered,
  ListPlus,
  ListRestart,
  ListStart,
  ListTodo,
  ListTree,
  ListVideo,
  ListX,
  Loader,
  Loader2,
  Locate,
  LocateFixed,
  LocateOff,
  Lock,
  LockKeyhole,
  LogIn,
  LogOut,
  Lollipop,
  Luggage,
  MSquare,
  Magnet,
  Mail,
  MailCheck,
  MailMinus,
  MailOpen,
  MailPlus,
  MailQuestion,
  MailSearch,
  MailWarning,
  MailX,
  Mailbox,
  Mails,
  Map,
  MapPin,
  MapPinOff,
  MapPinned,
  Martini,
  Maximize,
  Maximize2,
  Medal,
  Megaphone,
  MegaphoneOff,
  Meh,
  MemoryStick,
  Menu,
  MenuSquare,
  Merge,
  MessageCircle,
  MessageCircleCode,
  MessageCircleDashed,
  MessageCircleHeart,
  MessageCircleMore,
  MessageCircleOff,
  MessageCirclePlus,
  MessageCircleQuestion,
  MessageCircleReply,
  MessageCircleWarning,
  MessageCircleX,
  MessageSquare,
  MessageSquareCode,
  MessageSquareDashed,
  MessageSquareDiff,
  MessageSquareDot,
  MessageSquareHeart,
  MessageSquareMore,
  MessageSquareOff,
  MessageSquarePlus,
  MessageSquareQuote,
  MessageSquareReply,
  MessageSquareShare,
  MessageSquareText,
  MessageSquareWarning,
  MessageSquareX,
  MessagesSquare,
  Mic,
  Mic2,
  MicOff,
  Microscope,
  Microwave,
  Milestone,
  Milk,
  MilkOff,
  Minimize,
  Minimize2,
  Minus,
  MinusCircle,
  MinusSquare,
  Monitor,
  MonitorCheck,
  MonitorDot,
  MonitorDown,
  MonitorOff,
  MonitorPause,
  MonitorPlay,
  MonitorSmartphone,
  MonitorSpeaker,
  MonitorStop,
  MonitorUp,
  MonitorX,
  Moon,
  MoonStar,
  MoreHorizontal,
  MoreVertical,
  Mountain,
  MountainSnow,
  Mouse,
  MousePointer,
  MousePointer2,
  MousePointerClick,
  MousePointerSquare,
  MousePointerSquareDashed,
  Move,
  Move3d,
  MoveDiagonal,
  MoveDiagonal2,
  MoveDown,
  MoveDownLeft,
  MoveDownRight,
  MoveHorizontal,
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveUpLeft,
  MoveUpRight,
  MoveVertical,
  Music,
  Music2,
  Music3,
  Music4,
  Navigation,
  Navigation2,
  Navigation2Off,
  NavigationOff,
  Network,
  Newspaper,
  Nfc,
  Notebook,
  NotebookPen,
  NotebookTabs,
  NotebookText,
  NotepadText,
  NotepadTextDashed,
  Nut,
  NutOff,
  Octagon,
  Option,
  Orbit,
  Outdent,
} from '@tamagui/lucide-icons';
