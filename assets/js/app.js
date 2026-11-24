
/*
  SCHOLAR NOTES - PAYMENT SYSTEM

  Free previews remain public.
  Full PDFs are delivered only after successful payment.
  Price: Rs. 149 per product.
*/

// --------------------------------------------------
// 1. SUPABASE CONFIGURATION
// --------------------------------------------------

// Replace these two values with your own Supabase details.
const SUPABASE_URL = "https://gsvhkaumjlgxnkzcvopj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdmhrYXVtamxneG5remN2b3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0OTc5NjUsImV4cCI6MjExMTA3Mzk2NX0.WbFtW9AeyWCPXYafzUPnxxmIN8kRjZrh4XZWF7cn5Rg";

// --------------------------------------------------
// 2. PRODUCTS
// --------------------------------------------------

const products = [
  {
    id: "cgset",
    title: "CG SET Notes",
    tag: "CG SET",
    description: "Exam-focused study material for CG SET preparation.",
    previewFile: "pdfs/previews/CGSET Pre.pdf",
    downloadLabel: "Buy CG SET Full Notes"
  },
  {
    id: "ugcnet",
    title: "UGC NET Paper 1 Notes",
    tag: "UGC NET",
    description: "Teaching Aptitude, Research Aptitude and other Paper 1 topics.",
    previewFile: "pdfs/previews/UGC NET Pre.pdf",
    downloadLabel: "Buy UGC NET Full Notes"
  }
];

const productGrid = document.getElementById("product-grid");

// --------------------------------------------------
// 3. LOAD RAZORPAY CHECKOUT
// --------------------------------------------------

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(
      new Error("Could not load Razorpay. Please check your internet connection.")
    );

    document.body.appendChild(script);
  });
}

// --------------------------------------------------
// 4. CREATE PAYMENT ORDER
// --------------------------------------------------

async function createPaymentOrder(productId) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-payment-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        productId: productId
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Could not create payment order.");
  }

  return result;
}

// --------------------------------------------------
// 5. VERIFY PAYMENT
// --------------------------------------------------

async function verifyPayment(productId, paymentDetails) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/verify-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        productId: productId,
        razorpay_order_id: paymentDetails.razorpay_order_id,
        razorpay_payment_id: paymentDetails.razorpay_payment_id,
        razorpay_signature: paymentDetails.razorpay_signature
      })
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success || !result.download_url) {
    throw new Error(result.error || "Payment verification failed.");
  }

  return result;
}

// --------------------------------------------------
// 6. START PURCHASE
// --------------------------------------------------

async function startPurchase(product, button, status, downloadLink) {
  if (
    SUPABASE_URL.includes("YOUR_SUPABASE") ||
    SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
  ) {
    alert("Supabase configuration is missing. Please contact the website owner.");
    return;
  }

  button.disabled = true;
  status.textContent = "Preparing secure payment...";

  try {
    await loadRazorpay();

    const order = await createPaymentOrder(product.id);

    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "Scholar Notes",
      description: product.title,
      order_id: order.order_id,

      theme: {
        color: "#C6A15B"
      },

      handler: async function (paymentDetails) {
        status.textContent = "Payment received. Verifying securely...";

        try {
          const verified = await verifyPayment(
            product.id,
            paymentDetails
          );

          downloadLink.href = verified.download_url;
          downloadLink.hidden = false;

          status.textContent =
            "Payment successful! Your download is ready. The link expires in 5 minutes.";

          button.textContent = "Payment Successful";
        } catch (error) {
          console.error("Verification error:", error);

          status.textContent =
            "Payment was submitted, but verification could not be completed. Please contact Scholar Notes support before trying again.";

          button.disabled = false;
        }
      },

      modal: {
        ondismiss: function () {
          if (downloadLink.hidden) {
            status.textContent = "Payment window closed. You can try again.";
            button.disabled = false;
          }
        }
      }
    };

    const checkout = new window.Razorpay(options);

    checkout.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);

      status.textContent =
        "Payment was unsuccessful. Please try again.";

      button.disabled = false;
    });

    checkout.open();

  } catch (error) {
    console.error("Purchase error:", error);

    status.textContent = error.message ||
      "Something went wrong. Please try again.";

    button.disabled = false;
  }
}

// --------------------------------------------------
// 7. CREATE PRODUCT CARDS
// --------------------------------------------------

function makeProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const top = document.createElement("div");
  top.className = "product-card-top";

  const tag = document.createElement("span");
  tag.className = "product-tag";
  tag.textContent = product.tag;

  const title = document.createElement("h3");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  top.append(tag, title, description);

  // Free preview
  const actions = document.createElement("div");
  actions.className = "product-actions";

  const previewButton = document.createElement("button");
  previewButton.className = "button button-primary";
  previewButton.type = "button";
  previewButton.textContent = "Explore Notes";

  const previewPanel = document.createElement("div");
  previewPanel.className = "preview-panel";
  previewPanel.hidden = true;

  const previewHeading = document.createElement("h4");
  previewHeading.textContent = "Free PDF Preview";

  const frame = document.createElement("iframe");
  frame.className = "preview-frame";
  frame.title = `${product.title} free preview`;
  frame.loading = "lazy";
  frame.src = product.previewFile;

  const previewHelp = document.createElement("p");
  previewHelp.className = "preview-help";
  previewHelp.textContent =
    "The preview opens here. If it does not appear, check that the preview PDF is in the correct folder.";

  const openPreview = document.createElement("a");
  openPreview.className = "download-link";
  openPreview.href = product.previewFile;
  openPreview.target = "_blank";
  openPreview.rel = "noopener";
  openPreview.textContent = "Open preview in a new tab";

  previewPanel.append(
    previewHeading,
    frame,
    previewHelp,
    openPreview
  );

  previewButton.addEventListener("click", () => {
    const opening = previewPanel.hidden;

    previewPanel.hidden = !opening;
    previewButton.textContent = opening
      ? "Hide Preview"
      : "Explore Notes";

    if (opening) {
      previewPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  });

  actions.append(previewButton);

  // Paid download section
  const downloadArea = document.createElement("div");
  downloadArea.className = "download-area";

  const downloadText = document.createElement("p");
  downloadText.textContent = "Full notes price: ₹149";

  const buyButton = document.createElement("button");
  buyButton.className = "button button-primary";
  buyButton.type = "button";
  buyButton.textContent = product.downloadLabel;

  const status = document.createElement("p");
  status.className = "preview-help";
  status.setAttribute("aria-live", "polite");

  const downloadLink = document.createElement("a");
  downloadLink.className = "download-link";
  downloadLink.textContent = "Download Your Full Notes";
  downloadLink.hidden = true;
  downloadLink.target = "_blank";
  downloadLink.rel = "noopener";

  buyButton.addEventListener("click", () => {
    startPurchase(product, buyButton, status, downloadLink);
  });

  downloadArea.append(
    downloadText,
    buyButton,
    status,
    downloadLink
  );

  card.append(
    top,
    actions,
    previewPanel,
    downloadArea
  );

  return card;
}

// --------------------------------------------------
// 8. DISPLAY PRODUCTS
// --------------------------------------------------

if (productGrid) {
  products.forEach((product) => {
    productGrid.appendChild(makeProductCard(product));
  });
}

const yearElement = document.getElementById("current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
