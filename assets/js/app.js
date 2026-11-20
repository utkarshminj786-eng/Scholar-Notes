/*
  EDIT YOUR NOTES HERE.
  Keep the PDF filenames the same as the files you place in the pdfs folders.
  Preview PDFs should contain only the pages you want visitors to see.
*/
const products = [
  {
    id: "cgset",
    title: "CG SET Notes",
    tag: "CG SET",
    description: "Exam-focused study material for CG SET preparation.",
    previewFile: "pdfs/previews/Paper 1 Pre.pdf",
    fullFile: "pdfs/full/Paper 1 full.pdf",
    downloadLabel: "Download CG SET Full Notes"
  },
  {
    id: "ugcnet",
    title: "UGC NET Paper 1 Notes",
    tag: "UGC NET",
    description: "Teaching Aptitude, Research Aptitude and other Paper 1 topics.",
    previewFile: "pdfs/previews/UGCNET_Preview.pdf",
    fullFile: "pdfs/full/UGCNET_Full.pdf",
    downloadLabel: "Download UGC NET Full Notes"
  }
];

const productGrid = document.getElementById("product-grid");

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
  previewHelp.textContent = "The preview opens here. If it does not appear, check that the preview PDF is in the correct folder.";

  const openPreview = document.createElement("a");
  openPreview.className = "download-link";
  openPreview.href = product.previewFile;
  openPreview.target = "_blank";
  openPreview.rel = "noopener";
  openPreview.textContent = "Open preview in a new tab";

  previewPanel.append(previewHeading, frame, previewHelp, openPreview);

  previewButton.addEventListener("click", () => {
    const opening = previewPanel.hidden;
    previewPanel.hidden = !opening;
    previewButton.textContent = opening ? "Hide Preview" : "Explore Notes";
    if (opening) previewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  actions.append(previewButton);

  const downloadArea = document.createElement("div");
  downloadArea.className = "download-area";

  const downloadText = document.createElement("p");
  downloadText.textContent = "Full notes download (for local testing only):";

  const downloadLink = document.createElement("a");
  downloadLink.className = "download-link";
  downloadLink.href = product.fullFile;
  downloadLink.setAttribute("download", "");
  downloadLink.textContent = product.downloadLabel;

  downloadArea.append(downloadText, downloadLink);
  card.append(top, actions, previewPanel, downloadArea);
  return card;
}

products.forEach((product) => productGrid.appendChild(makeProductCard(product)));
document.getElementById("current-year").textContent = new Date().getFullYear();
