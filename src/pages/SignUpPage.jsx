import taxios from "../utils/taxios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CountryData from "../data/country.json";
import { useTranslation } from "react-i18next";

export default function SignUpPage({ provider }) {
  const [t, i18n] = useTranslation();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [oAuthData, setOAuthData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    async function getOAuthData() {
      try {
        if (provider) {
          const checkUrl = `/auth/${provider}/check?code=${code}&state=${state}`;
          const checkResponse = await taxios.get(checkUrl);
          const checkData = checkResponse.data;

          const authUrl = `/auth/signin/oauth`; // this must have provider and openid sub
          const authResponse = await taxios.post(authUrl, {
            provider,
            oauthid: checkData.oauthid,
          });
          if (authResponse.status === 200) {
            localStorage.setItem("accessToken", authResponse.data.accessToken);
            window.location.href = "/testauth";
            return;
          }

          setOAuthData(checkData);
          setName(checkData.name || "");
        }
      } catch (error) {
        console.error("Error fetching OAuth data:", error);
        provider = null;
      }
    }

    getOAuthData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    // Handle form submission
    const formData = new FormData(event.target);

    // Validation checks
    if (
      !(email || oAuthData?.email) ||
      !password ||
      !passwordRepeat ||
      !name ||
      !birth ||
      !nickname ||
      !phone ||
      !country ||
      !role ||
      !org
    ) {
      alert("All fields are required");
      return;
    }

    if (password !== passwordRepeat) {
      alert("Passwords do not match");
      return;
    }

    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone format must be 000-0000-0000");
      return;
    }

    // Make axios post request
    try {
      const payload = {
        email: oAuthData?.email || email,
        password,
        name,
        birth,
        nickname,
        phone,
        country,
        org,
        provider,
        role,
        oauthid: oAuthData?.oauthid || null,
      };
      console.log(payload);
      const response = await taxios.post(
        "http://localhost:8999/api/auth/signup",
        payload
      );
      console.log("Sign up successful:", response.data);
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    }
  }

  return (
    <div className="text-left">
      <form onSubmit={handleSubmit}>
        <datalist id="country-list">
          {Object.entries(CountryData).map(([key, value]) => (
            <option key={key} value={key}>
              {i18n.language === "ko" ? value.korean : value.japanese}
            </option>
          ))}
        </datalist>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={oAuthData?.email || email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">패스워드</label>
        <br />
        <input
          type="password"
          placeholder="비밀번호"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <label htmlFor="passwordrepeat">패스워드 재확인</label>
        <br />
        <input
          type="password"
          placeholder="비밀번호 재확인"
          id="passwordrepeat"
          name="passwordrepeat"
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
        />
        <br />
        <label htmlFor="name">이름</label>
        <br />
        <input
          type="text"
          id="name"
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="birthdate">생년월일</label>
        <br />
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
        />
        <br />
        <label htmlFor="nickname">닉네임</label>
        <br />
        <input
          type="text"
          name="nickname"
          id="nickname"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <br />
        <label htmlFor="phone">전화번호</label>
        <br />
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />
        <label htmlFor="country">국가</label>
        <br />
        <input
          list="country-list"
          id="country"
          name="country"
          placeholder={i18n.language === "ko" ? "국가" : "Country"}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <br />
        <label htmlFor="org">조직</label>
        <br />
        <input
          type="text"
          id="org"
          name="org"
          placeholder="조직"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
        />
        <br />
        <label htmlFor="role">역할</label>
        <br />
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
