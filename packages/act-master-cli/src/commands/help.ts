export const helpCommand = () => {
  const helpText = `
┌──────────────────────────────────────────────────────────────┐
│ act-master-cli                                               │
└──────────────────────────────────────────────────────────────┘
 commands:
   init         │ Generate init file
   generate, g  │ Generate interface and index actions files
   help         │ Show current message
`;
  console.log(helpText);
};
