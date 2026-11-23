import { useId, useState } from "react";
import "./CategoryMatchingFormPage.scss";
import BottomButton from "../../Onboarding/Preference/components/BottomButton";

const CategoryMatchingFormPage = ({
  initialValues = {},
  onSubmit,
  submitting = false,
}) => {
  const id = useId();

  // 희망 조건과 인원을 각각 입력해서 관리
  const [admissionYearMin, setAdmissionYearMin] = useState(
    initialValues.admissionYearMin ?? "",
  );
  const [admissionYearMax, setAdmissionYearMax] = useState(
    initialValues.admissionYearMax ?? "",
  );
  const [department, setDepartment] = useState(initialValues.department ?? "");
  const [mbti, setMbti] = useState(initialValues.mbti ?? "");
  const [memberCount, setMemberCount] = useState(initialValues.memberCount ?? 3);
  const [allowPartialMatch, setAllowPartialMatch] = useState(
    initialValues.allowPartialMatch ?? true,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting || !onSubmit) return;

    onSubmit({
      memberCount: Number(memberCount),
      conditions: {
        admissionYearMin: Number(admissionYearMin),
        admissionYearMax: Number(admissionYearMax),
        department: department.trim() || null,
        mbti: mbti.trim().toUpperCase() || null,
      },
      allowPartialMatch,
    });
  };

  return (
    <form className="category_form" onSubmit={handleSubmit}>
      <fieldset disabled={submitting}>
        <legend>희망 조건</legend>
        <div className="category_form_field category_form_field_years">
          <span id={`${id}-years`}>학번</span>
          <div className="category_form_years" role="group" aria-labelledby={`${id}-years`}>
            <input
              aria-label="최소 학번"
              type="number"
              inputMode="numeric"
              name="admissionYearMin"
              min="0"
              max="99"
              required
              value={admissionYearMin}
              onChange={(e) => setAdmissionYearMin(e.target.value)}
            />
            <span aria-hidden="true">~</span>
            <input
              aria-label="최대 학번"
              type="number"
              inputMode="numeric"
              name="admissionYearMax"
              min={admissionYearMin === "" ? 0 : Number(admissionYearMin)}
              max="99"
              required
              value={admissionYearMax}
              onChange={(e) => setAdmissionYearMax(e.target.value)}
            />
          </div>
        </div>
        <label className="category_form_field" htmlFor={`${id}-department`}>
          <span>학과</span>
          <input
            id={`${id}-department`}
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </label>
        <label className="category_form_field" htmlFor={`${id}-mbti`}>
          <span>MBTI</span>
          <input
            id={`${id}-mbti`}
            type="text"
            name="mbti"
            maxLength={4}
            pattern="[IiEe][SsNn][TtFf][JjPp]"
            title="MBTI 네 글자를 입력해 주세요. 예: INFJ"
            autoCapitalize="characters"
            spellCheck={false}
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset disabled={submitting} className="category_form_members">
        <legend>희망 인원</legend>
        <label className="category_form_count" htmlFor={`${id}-count`}>
          <input
            id={`${id}-count`}
            aria-label="희망 인원"
            type="number"
            inputMode="numeric"
            name="memberCount"
            min="2"
            max="4"
            required
            value={memberCount}
            onChange={(e) => setMemberCount(e.target.value)}
          />
          <span>명</span>
        </label>
      </fieldset>

      <label className="category_form_partial">
        <span>조건이 전부 맞지 않아도 매칭할래요</span>
        <input
          type="checkbox"
          role="switch"
          name="allowPartialMatch"
          checked={allowPartialMatch}
          onChange={(e) => setAllowPartialMatch(e.target.checked)}
          disabled={submitting}
        />
      </label>
      <div className="category_form_submit">
        <BottomButton type="submit" disabled={submitting}>
          {submitting ? "신청 중…" : "매칭 신청"}
        </BottomButton>
      </div>
    </form>
  );
};

export default CategoryMatchingFormPage;
