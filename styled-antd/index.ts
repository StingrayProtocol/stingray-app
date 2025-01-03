import {
  Button as AntdButton,
  Flex as AntdFlex,
  Input as AntdInput,
  Tooltip as AntdTooltip,
  Typography,
  Divider as AntdDivider,
  Modal as AntdModal,
  Row as AntdRow,
  Col as AntdCol,
  Slider as AntdSlider,
  InputNumber as AntdInputNumber,
  Radio as AntdRadio,
  Select as AntdSelect,
  Statistic as AntdStatistic,
  Tag as AntdTag,
  Segmented as AntdSegmented,
  Form as AntdForm,
  Steps as AntdSteps,
  Image as AntdImage,
  Checkbox as AntdCheckbox,
  Upload as AntdUpload,
  Tabs as AntdTabs,
  Progress as AntdProgress,
  Table as AntdTable,
} from "antd";
import styled from "styled-components";

export const Title = styled(Typography.Title)`
  color: #fafafc !important;
  margin: 0 !important;
  font-family: Kusanagi;
`;

export const Text = styled(Typography.Text)`
  margin: 0 !important;
  word-break: normal;
  font-family: Montserrat;
`;

export const Button = styled(AntdButton)`
  font-family: Montserrat;
`;

export const Flex = styled(AntdFlex)``;

export const Input = styled(AntdInput)``;

export const Tooltip = styled(AntdTooltip)`
  .ant-tooltip-inner {
    background: rgba(0, 0, 23, 0.85);
  }
  .ant-tooltip-arrow-content {
    border-top-color: rgba(0, 0, 23, 0.85) !important;
  }
`;

export const Divider = styled(AntdDivider)`
  margin: 0 !important;
  background: #313133 !important;
`;

export const Row = styled(AntdRow)``;

export const Col = styled(AntdCol)``;

export const Slider = styled(AntdSlider)`
  .ant-slider-rail {
  }
`;

export const InputNumber = styled(AntdInputNumber)``;

export const Modal = styled(AntdModal)`
  .ant-modal-content {
    background: rgba(0, 0, 23, 0.85);
  }
  .ant-modal-header {
    background: rgba(0, 0, 23, 0.85);
  }
`;

export const Select = styled(AntdSelect)`
  .ant-select-selector {
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 40px !important;
  }
`;

export const Radio = styled(AntdRadio)``;

export const Segmented = styled(AntdSegmented)`
  font-family: Montserrat;
  .ant-segmented-item {
    margin-left: 4px !important;
    margin-right: 4px !important;
    padding: 4px !important;
    border-radius: 8px !important;
    background: rgba(255, 255, 255, 0.1);
  }
  .ant-segmented-item-label {
    text-overflow: inherit !important;
  }
`;

export const Statistic = styled(AntdStatistic)`
  .ant-statistic-content {
    font-size: 20px;
  }
`;

export const Tag = styled(AntdTag)``;

export const Form = styled(AntdForm)`
  .ant-form-item-control {
    flex: none !important;
    width: 100% !important;
  }
`;

export const Steps = styled(AntdSteps)`
  .ant-steps-item-finish .ant-steps-item-icon {
    background-color: rgba(155, 155, 155, 0.5) !important;
  }
`;

export const Image = styled(AntdImage)``;

export const Checkbox = styled(AntdCheckbox)``;

export const Upload = styled(AntdUpload)`
  .ant-upload-select {
    width: 100% !important;
    height: 100% !important;
  }
  .ant-upload-wrapper {
    width: 100% !important;
    height: 100% !important;
  }
`;

export const Progress = styled(AntdProgress)``;

export const Tabs = styled(AntdTabs)``;

export const Table = styled(AntdTable)`
  .ant-table td,
  .ant-table th {
    border: none !important;
  }
  .ant-table-footer {
    display: none !important;
  }
  /* Add background on hover */
  .ant-table-row-hover {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  /* Apply border-radius to the first and last cells of the last row */
  .ant-table tbody > tr:last-child > td:first-child {
    border-bottom-left-radius: 40px; /* Adjust value as needed */
  }

  .ant-table tbody > tr:last-child > td:last-child {
    border-bottom-right-radius: 40px; /* Adjust value as needed */
  }

  /* Ensure that the hover effect includes border-radius */
  .ant-table tbody > tr:last-child:hover > td:first-child {
    border-bottom-left-radius: 40px; /* Adjust value as needed */
  }

  .ant-table tbody > tr:last-child:hover > td:last-child {
    border-bottom-right-radius: 40px; /* Adjust value as needed */
  }

  /* Prevent clipping of rounded corners */
  .ant-table-container {
    overflow: hidden;
  }

  /* Ensure that the table container allows for visible rounded corners */
  .ant-table-container {
    overflow: hidden;
  }
  .ant-table {
    background: transparent;
  }
  .ant-table-container {
    border: none !important;
  }
`;

// colors: {
//   neutral: {
//     50: '#FAFAFC',
//     100: '#ECECED',
//     200: '#DCDCDE',
//     300: '#C6C6C9',
//     400: '#A4A4A6',
//     500: '#727274',
//     600: '#49494E',
//     700: '#313133',
//     800: '#232326',
//     900: '#181821',
//   },
//   darkTheme: {
//     50: '#36363C',
//     100: '#333339',
//     200: '#313136',
//     300: '#2F2F32',
//     400: '#2A2A2F',
//     500: '#25252C',
//     600: '#22222A',
//     700: '#1F1F26',
//     800: '#17171c',
//     900: '#111116',
//   },
//   primary: {
//     50: '#FDDAE5',
//     100: '#FCB5D3',
//     200: '#F68EC4',
//     300: '#EE71BE',
//     400: '#E444B6',
//     500: '#C431A8',
//     600: '#A42298',
//     700: '#831584',
//     800: '#630D6D',
//     900: '#630D6D',
//   },
//   success: {
//     50: '#E1FCDB',
//     100: '#BFFAB8',
//     200: '#92F191',
//     300: '#72E37C',
//     400: '#47D160',
//     500: '#33B357',
//     600: '#23964E',
//     700: '#167944',
//     800: '#0D643E',
//     900: '#0D643E',
//   },
//   info: {
//     50: '#D7F3FF',
//     100: '#AFE4FF',
//     200: '#87D1FF',
//     300: '#69BDFF',
//     400: '#389EFF',
//     500: '#287BDB',
//     600: '#1C5BB7',
//     700: '#114093',
//     800: '#0A2D7A',
//     900: '#0A2D7A',
//   },
//   warning: {
//     50: '#FFF5D8',
//     100: '#FFE8B1',
//     200: '#FFD88A',
//     300: '#FFC86D',
//     400: '#FFAE3D',
//     500: '#DB8A2C',
//     600: '#B76A1E',
//     700: '#934D13',
//     800: '#7A390B',
//     900: '#7A390B',
//   },
//   danger: {
//     50: '#FFDCDE',
//     100: '#FFBAC4',
//     200: '#FF98B2',
//     300: '#FF7EAB',
//     400: '#FF54A1',
//     500: '#DB3D94',
//     600: '#B72A86',
//     700: '#931A75',
//     800: '#7A106A',
//     900: '#7A106A',
//   },
// },
