import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SajuSetting from "./SajuSetting";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const fillBirthDetails = () => {
  fireEvent.change(screen.getByRole("textbox", { name: "생년월일" }), {
    target: { value: " 260805 " },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "태어난 시간" }), {
    target: { value: " 12:00 " },
  });
};

test("requires both nonblank birth details when matching is allowed", () => {
  render(<SajuSetting />);
  const completeButton = screen.getByRole("button", { name: "설정 완료" });

  expect(completeButton).toBeDisabled();
  fireEvent.change(screen.getByLabelText("생년월일"), {
    target: { value: "260805" },
  });
  fireEvent.change(screen.getByLabelText("태어난 시간"), {
    target: { value: "   " },
  });
  expect(completeButton).toBeDisabled();
  fireEvent.click(completeButton);
  expect(localStorage.getItem("sajuSettings")).toBeNull();
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
});

test("saves trimmed settings and announces completion", () => {
  render(<SajuSetting />);
  fillBirthDetails();
  fireEvent.click(screen.getByRole("button", { name: "설정 완료" }));

  expect(JSON.parse(localStorage.getItem("sajuSettings"))).toEqual({
    isAllowed: true,
    birthDate: "260805",
    birthTime: "12:00",
  });
  expect(screen.getByRole("status")).toHaveTextContent("설정이 저장되었어요.");
});

test("saves disabled matching without hidden birth details", () => {
  render(<SajuSetting />);
  fillBirthDetails();
  fireEvent.click(screen.getByRole("checkbox", { name: "사주기반 매칭 허용" }));

  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "설정 완료" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "설정 완료" }));
  expect(JSON.parse(localStorage.getItem("sajuSettings"))).toEqual({
    isAllowed: false,
    birthDate: "",
    birthTime: "",
  });
  expect(screen.getByRole("status")).toHaveTextContent("설정이 저장되었어요.");
});

test("reports storage failures and allows retrying", () => {
  const save = jest.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
    throw new Error("Storage unavailable");
  });
  render(<SajuSetting />);
  fillBirthDetails();
  const completeButton = screen.getByRole("button", { name: "설정 완료" });
  fireEvent.click(completeButton);

  expect(screen.getByRole("status")).toHaveTextContent("설정을 저장하지 못했어요.");
  expect(localStorage.getItem("sajuSettings")).toBeNull();
  fireEvent.click(completeButton);
  expect(save).toHaveBeenCalledTimes(2);
  expect(screen.getByRole("status")).toHaveTextContent("설정이 저장되었어요.");
});

test.each(["생년월일", "태어난 시간", "사주기반 매칭 허용"])(
  "clears the previous result when %s changes",
  (label) => {
    render(<SajuSetting />);
    fillBirthDetails();
    fireEvent.click(screen.getByRole("button", { name: "설정 완료" }));

    if (label === "사주기반 매칭 허용") {
      fireEvent.click(screen.getByLabelText(label));
    } else {
      fireEvent.change(screen.getByLabelText(label), { target: { value: "" } });
    }
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  }
);
