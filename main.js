document
  .getElementById("passport-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = capitalizeFullName(
      document.getElementById("full-name").value
    );
    const idCard = document.getElementById("id-card").value;
    const mobileNumber = document.getElementById("mobile-number").value;

    // Validate mobile number
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobileNumber)) {
      alert("Invalid mobile number format");
      return;
    }

    // Generate unique passport number
    const passportNumber = generatePassportNumber(fullName, idCard);

    // Generate random release date in the past
    const releaseDate = generateRandomDate();
    const { years, days } = calculateYearsAndDaysAgo(releaseDate);

    // Determine the time ago text
    const timeAgoText = years > 0 ? `${years} years ago` : `${days} days ago`;

    // Update result
    document.getElementById("result-name").textContent = fullName;
    document.getElementById("result-passport-number").textContent =
      passportNumber;
    document.getElementById(
      "result-release-date"
    ).textContent = `${releaseDate} (${timeAgoText})`;

    // Add to recent passports list
    addToRecentPassports(fullName, passportNumber, releaseDate);
  });

function capitalizeFullName(fullName) {
  return fullName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function generatePassportNumber(fullName, idCard) {
  const prefix = fullName.slice(0, 2).toUpperCase() + idCard.slice(0, 2);
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${randomPart.slice(0, 4)}-${randomPart.slice(4, 8)}`;
}

function generateRandomDate() {
  const end = new Date();
  const start = new Date(end.getFullYear() - 10, end.getMonth(), end.getDate());
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

function calculateYearsAndDaysAgo(date) {
  const releaseDate = new Date(date);
  const currentDate = new Date();

  // Calculate the difference in years
  let yearsAgo = currentDate.getFullYear() - releaseDate.getFullYear();

  // Adjust if the release date hasn't occurred yet this year
  const monthDifference = currentDate.getMonth() - releaseDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < releaseDate.getDate())
  ) {
    yearsAgo--;
  }

  // Calculate the difference in days if yearsAgo is 0
  let daysAgo = 0;
  if (yearsAgo === 0) {
    const timeDifference = currentDate - releaseDate;
    daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  }

  return { years: yearsAgo, days: daysAgo };
}

function addToRecentPassports(name, passportNumber, releaseDate) {
  const list = document.getElementById("recent-list");
  const { years, days } = calculateYearsAndDaysAgo(releaseDate);

  // Determine the time ago text
  const timeAgoText = years > 0 ? `${years} years ago` : `${days} days ago`;

  const item = document.createElement("li");
  item.innerHTML = `Name: ${name}<br> 
  Passport Number: ${passportNumber}<br>
  Release Date: ${releaseDate} (${timeAgoText})`;
  list.insertBefore(item, list.firstChild);

  if (list.children.length > 3) {
    list.removeChild(list.lastChild);
  }

  toggleRecentPassports();
}

function toggleRecentPassports() {
  const list = document.getElementById("recent-list");
  const recentPassportsSection = document.getElementById("recent-passports");
  const recentPassportsHeader = document.getElementById(
    "recent-passports-header"
  );

  if (list.children.length > 0) {
    recentPassportsSection.style.display = "block";
    recentPassportsHeader.textContent = `Recent ${list.children.length} Passports`;
  } else {
    recentPassportsSection.style.display = "none";
  }
}
