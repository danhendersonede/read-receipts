// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma;
const {
  useSyncedState,
  useSyncedMap,
  usePropertyMenu,
  AutoLayout,
  Text,
  SVG,
  Input,
  Ellipse,
} = widget;

class ReadReceipt {
  id: string;
  role: string = "";
  checked: boolean = false;
  checkedBy: string = "";
  checkedDate: string | null = null;

  constructor(id: number) {
    this.id = String(id);
  }
}

function Widget() {
  const readReceipts = useSyncedMap<ReadReceipt>("readReceipts");

  function toggleCheck(readReceipt: ReadReceipt) {
    if (!readReceipt.checked) {
      if (readReceipt.role.length > 0) {
        let checkedBy = "";

        if (figma.currentUser) {
          checkedBy = figma.currentUser.name;
        } else {
          checkedBy = "Visitor";
        }

        const checkedDate = new Date().toString();

        readReceipts.set(readReceipt.id, {
          ...readReceipt,
          checked: true,
          checkedBy,
          checkedDate,
        });
      } else {
        figma.notify(
          "Cannot check read receipt without adding a Role/Discipline."
        );
      }
    } else {
      readReceipts.set(readReceipt.id, {
        ...readReceipt,
        checked: false,
        checkedBy: "",
        checkedDate: null,
      });
    }
  }

  function updateRole(event: any, readReceipt: ReadReceipt) {
    const characters = event.characters;

    if (characters.length > 0) {
      readReceipts.set(readReceipt.id, {
        ...readReceipt,
        role: event.characters,
      });
    } else {
      if (readReceipt.checked) {
        figma.notify("Cannot delete row. Read receipt must be unchecked.");
      } else {
        readReceipts.delete(readReceipt.id);
      }
    }
  }

  function getCheckedDateFormat(checkedDate: string) {
    const date = new Date(checkedDate);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}`;
  }

  const svgSuccess = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="20" fill="#00A310"/>
    <path d="M9.5 19.5L6 24L17 31L33 14L28 9L16 24L9.5 19.5Z" fill="white" stroke="white"/>
    </svg>
  `;

  function renderReadReceipt(readReceipt: ReadReceipt) {
    return (
      <AutoLayout
        spacing={16}
        direction={"horizontal"}
        width={"fill-parent"}
        key={readReceipt.id}
      >
        <AutoLayout
          direction="vertical"
          horizontalAlignItems={"center"}
          width={65}
          spacing={6}
        >
          {!readReceipt.checked ? (
            <Ellipse
              height={40}
              width={40}
              stroke={"#000000"}
              fill={"#ffffff"}
              onClick={() => toggleCheck(readReceipt)}
            />
          ) : (
            <SVG src={svgSuccess} onClick={() => toggleCheck(readReceipt)} />
          )}
          {readReceipt.checkedDate ? (
            <Text fontSize={18}>
              {getCheckedDateFormat(readReceipt.checkedDate)}
            </Text>
          ) : null}
        </AutoLayout>
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Input
            value={readReceipt.role}
            fontSize={32}
            onTextEditEnd={(event) => updateRole(event, readReceipt)}
            width={"fill-parent"}
            placeholder={"Role/Discipline"}
          />
          {readReceipt.checkedBy ? (
            <Text fontSize={24}>{readReceipt.checkedBy}</Text>
          ) : null}
        </AutoLayout>
      </AutoLayout>
    );
  }

  return (
    <AutoLayout
      spacing={16}
      padding={16}
      cornerRadius={16}
      fill={"#FFFFFF"}
      stroke={"#E6E6E6"}
      width={400}
      direction={"vertical"}
    >
      <AutoLayout padding={{ top: 16, left: 16, right: 0, bottom: 0 }}>
        <Text fontSize={36} fontWeight={700}>
          Read Receipts
        </Text>
      </AutoLayout>
      {readReceipts
        .entries()
        .map((readReceipt) => renderReadReceipt(readReceipt[1]))}
      {renderReadReceipt(new ReadReceipt(readReceipts.size + 1))}
    </AutoLayout>
  );
}

widget.register(Widget);
