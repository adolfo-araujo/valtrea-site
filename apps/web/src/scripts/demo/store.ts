import { wireCompare, wireTilt } from "./effects";
import { buildTalkLink, openTalk } from "../site/chat-data";

interface Choice {
  label: string;
  price?: number;
}

interface OptionGroup {
  id: string;
  label: string;
  type: "single" | "multi";
  required?: boolean;
  choices: Choice[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  options?: string[];
}

interface Area {
  name: string;
  fee: number;
}

interface StoreData {
  brand: string;
  whatsapp: string;
  email: string;
  subject: string;
  products: Product[];
  groups: OptionGroup[];
  areas?: Area[];
  shipping?: number;
  freeFrom?: number;
  minDelivery?: number;
}

interface Line {
  key: string;
  product: Product;
  picks: string[];
  extra: number;
  note: string;
  qty: number;
}

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function readData(): StoreData | null {
  const source = document.getElementById("store-data");
  if (!source?.textContent) return null;
  try {
    return JSON.parse(source.textContent) as StoreData;
  } catch (error) {
    void error;
    return null;
  }
}

function element<T extends Element>(tag: string, className: string, text?: string): T {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node as unknown as T;
}

function openDialog(dialog: HTMLDialogElement): void {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  document.body.classList.add("dialog-open");
}

function closeDialog(dialog: HTMLDialogElement): void {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
  if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
}

function wireDialogClosing(dialog: HTMLDialogElement): void {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
  });
  dialog.querySelectorAll<HTMLElement>("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => closeDialog(dialog));
  });
}

function startStore(data: StoreData): void {
  const lines: Line[] = [];
  const productById = new Map(data.products.map((product) => [product.id, product]));
  const groupById = new Map(data.groups.map((group) => [group.id, group]));
  const toast = document.querySelector<HTMLElement>("[data-toast]");
  const bag = document.querySelector<HTMLDialogElement>("dialog[data-bag]");
  const itemDialog = document.querySelector<HTMLDialogElement>("dialog[data-item-dialog]");
  const checkout = bag?.querySelector<HTMLFormElement>("form[data-checkout]");
  let toastTimer: ReturnType<typeof setTimeout> | undefined;
  const saveKey = `demo-bag:${data.brand}`;
  try {
    const saved = JSON.parse(sessionStorage.getItem(saveKey) ?? "[]") as (Omit<Line, "product"> & { id: string })[];
    for (const entry of saved) {
      const product = productById.get(entry.id);
      if (product) lines.push({ key: entry.key, product, picks: entry.picks, extra: entry.extra, note: entry.note, qty: entry.qty });
    }
  } catch (error) {
    void error;
  }
  const save = () => {
    try {
      sessionStorage.setItem(saveKey, JSON.stringify(lines.map(({ product, ...rest }) => ({ ...rest, id: product.id }))));
    } catch (error) {
      void error;
    }
  };

  const showToast = (text: string) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-shown"), 2200);
  };

  const subtotal = () => lines.reduce((sum, line) => sum + (line.product.price + line.extra) * line.qty, 0);

  const mode = () => checkout?.querySelector<HTMLInputElement>("input[name=mode]:checked")?.value ?? (data.shipping !== undefined ? "envio" : "");

  const fee = () => {
    const current = mode();
    if (current === "entrega") {
      const index = Number(checkout?.querySelector<HTMLSelectElement>("select[name=area]")?.value ?? "-1");
      return data.areas?.[index]?.fee ?? 0;
    }
    if (current === "envio" && data.shipping !== undefined) {
      return data.freeFrom !== undefined && subtotal() >= data.freeFrom ? 0 : data.shipping;
    }
    return 0;
  };

  const syncModeFields = () => {
    if (!checkout) return;
    const current = mode();
    checkout.querySelectorAll<HTMLElement>("[data-when-mode]").forEach((block) => {
      const show = (block.dataset.whenMode ?? "").split(" ").includes(current);
      block.hidden = !show;
      block.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea").forEach((field) => {
        field.disabled = !show;
      });
    });
    const payment = checkout.querySelector<HTMLSelectElement>("select[name=payment]")?.value ?? "";
    checkout.querySelectorAll<HTMLElement>("[data-when-cash]").forEach((block) => {
      block.hidden = payment !== "Dinheiro";
    });
  };

  const render = () => {
    save();
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    document.querySelectorAll<HTMLElement>("[data-bag-count]").forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
    document.querySelectorAll<HTMLElement>("[data-bag-total-mini]").forEach((label) => {
      label.textContent = money(subtotal());
    });
    document.body.classList.toggle("has-bag", count > 0);
    if (!bag) return;
    const list = bag.querySelector<HTMLElement>("[data-bag-items]");
    const empty = bag.querySelector<HTMLElement>("[data-bag-empty]");
    if (list) {
      list.replaceChildren(
        ...lines.map((line) => {
          const item = element<HTMLLIElement>("li", "bag-line");
          const info = element<HTMLDivElement>("div", "bag-info");
          info.append(element("strong", "", line.product.name));
          if (line.picks.length) info.append(element("span", "bag-picks", line.picks.join(" · ")));
          if (line.note) info.append(element("span", "bag-picks", `Obs.: ${line.note}`));
          info.append(element("span", "bag-price", money((line.product.price + line.extra) * line.qty)));
          const qty = element<HTMLDivElement>("div", "qty");
          const minus = element<HTMLButtonElement>("button", "qty-btn", "−");
          minus.type = "button";
          minus.setAttribute("aria-label", "Diminuir");
          const value = element<HTMLSpanElement>("span", "qty-value", String(line.qty));
          const plus = element<HTMLButtonElement>("button", "qty-btn", "+");
          plus.type = "button";
          plus.setAttribute("aria-label", "Aumentar");
          minus.addEventListener("click", () => {
            line.qty -= 1;
            if (line.qty <= 0) lines.splice(lines.indexOf(line), 1);
            render();
          });
          plus.addEventListener("click", () => {
            line.qty += 1;
            render();
          });
          qty.append(minus, value, plus);
          item.append(info, qty);
          return item;
        }),
      );
    }
    if (empty) empty.hidden = count > 0;
    if (checkout) checkout.hidden = count === 0;
    const set = (selector: string, text: string) => {
      bag.querySelectorAll<HTMLElement>(selector).forEach((node) => {
        node.textContent = text;
      });
    };
    const shippingFee = fee();
    set("[data-subtotal]", money(subtotal()));
    set("[data-fee]", shippingFee === 0 && mode() !== "" ? "Grátis" : money(shippingFee));
    set("[data-total]", money(subtotal() + shippingFee));
    const bar = bag.querySelector<HTMLElement>("[data-free-bar]");
    const barText = bag.querySelector<HTMLElement>("[data-free-text]");
    if (bar && data.freeFrom !== undefined) {
      const ratio = Math.min(1, subtotal() / data.freeFrom);
      bar.style.setProperty("--p", String(ratio));
      if (barText) {
        barText.textContent =
          ratio >= 1 ? "Você ganhou frete grátis!" : `Faltam ${money(data.freeFrom - subtotal())} para o frete grátis`;
      }
    }
  };

  const add = (product: Product, picks: string[], extra: number, note: string, qty: number) => {
    const key = `${product.id}|${picks.join("|")}|${note}`;
    const existing = lines.find((line) => line.key === key);
    if (existing) existing.qty += qty;
    else lines.push({ key, product, picks, extra, note, qty });
    render();
    showToast(`${product.name} na sacola`);
  };

  const openItem = (product: Product) => {
    if (!itemDialog) return;
    const form = itemDialog.querySelector<HTMLFormElement>("form[data-item-form]");
    const groupsBox = itemDialog.querySelector<HTMLElement>("[data-item-groups]");
    const submit = itemDialog.querySelector<HTMLElement>("[data-item-submit]");
    const qtyValue = itemDialog.querySelector<HTMLElement>("[data-qty-value]");
    const title = itemDialog.querySelector<HTMLElement>("[data-item-title]");
    if (!form || !groupsBox || !submit) return;
    let qty = 1;
    if (title) title.textContent = product.name;
    form.reset();

    groupsBox.replaceChildren(
      ...(product.options ?? []).map((groupId) => {
        const group = groupById.get(groupId);
        const fieldset = element<HTMLFieldSetElement>("fieldset", "opt-group");
        if (!group) return fieldset;
        const legend = element<HTMLLegendElement>("legend", "", group.label);
        if (group.required) legend.append(element("span", "opt-required", "obrigatório"));
        fieldset.append(legend);
        group.choices.forEach((choice, index) => {
          const label = element<HTMLLabelElement>("label", "opt");
          const input = document.createElement("input");
          input.type = group.type === "single" ? "radio" : "checkbox";
          input.name = group.id;
          input.value = String(index);
          if (group.type === "single" && group.required && index === 0) input.required = true;
          label.append(input, element("span", "opt-label", choice.label));
          if (choice.price) label.append(element("span", "opt-price", `+ ${money(choice.price)}`));
          fieldset.append(label);
        });
        return fieldset;
      }),
    );

    const picked = () => {
      const picks: string[] = [];
      let extra = 0;
      (product.options ?? []).forEach((groupId) => {
        const group = groupById.get(groupId);
        if (!group) return;
        form.querySelectorAll<HTMLInputElement>(`input[name="${groupId}"]:checked`).forEach((input) => {
          const choice = group.choices[Number(input.value)];
          if (!choice) return;
          picks.push(choice.label);
          extra += choice.price ?? 0;
        });
      });
      return { picks, extra };
    };

    const update = () => {
      const { extra } = picked();
      if (qtyValue) qtyValue.textContent = String(qty);
      submit.textContent = `Adicionar · ${money((product.price + extra) * qty)}`;
    };

    form.onchange = update;
    const minus = itemDialog.querySelector<HTMLButtonElement>("[data-qty-minus]");
    const plus = itemDialog.querySelector<HTMLButtonElement>("[data-qty-plus]");
    if (minus)
      minus.onclick = () => {
        qty = Math.max(1, qty - 1);
        update();
      };
    if (plus)
      plus.onclick = () => {
        qty += 1;
        update();
      };
    form.onsubmit = (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const { picks, extra } = picked();
      const note = (form.querySelector<HTMLTextAreaElement>("textarea[name=note]")?.value ?? "").trim();
      add(product, picks, extra, note, qty);
      closeDialog(itemDialog);
    };
    update();
    openDialog(itemDialog);
  };

  document.querySelectorAll<HTMLElement>("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = productById.get(button.dataset.add ?? "");
      if (!product) return;
      if (product.options?.length && itemDialog) openItem(product);
      else add(product, [], 0, "", 1);
    });
  });

  document.querySelectorAll<HTMLElement>("[data-bag-open]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!bag) return;
      const review = bag.querySelector<HTMLElement>("[data-review]");
      if (review) review.hidden = true;
      syncModeFields();
      render();
      openDialog(bag);
    });
  });
  if (bag) wireDialogClosing(bag);
  if (itemDialog) wireDialogClosing(itemDialog);

  if (checkout) {
    bag?.querySelector<HTMLButtonElement>("[data-review-back]")?.addEventListener("click", () => {
      const review = bag.querySelector<HTMLElement>("[data-review]");
      if (review) review.hidden = true;
      checkout.hidden = false;
    });
    checkout.addEventListener("change", () => {
      syncModeFields();
      render();
    });
    syncModeFields();
    checkout.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!lines.length || !checkout.reportValidity()) return;
      const minimum = data.minDelivery ?? 0;
      const warning = checkout.querySelector<HTMLElement>("[data-min-warning]");
      if (mode() === "entrega" && subtotal() < minimum) {
        if (warning) {
          warning.hidden = false;
          warning.textContent = `Para entrega, o pedido mínimo é ${money(minimum)}.`;
        }
        return;
      }
      if (warning) warning.hidden = true;
      const form = new FormData(checkout);
      const value = (name: string) => String(form.get(name) ?? "").trim();
      const current = mode();
      const shippingFee = fee();
      const out: string[] = [`*Pedido de demonstração · ${data.brand}*`, ""];
      lines.forEach((line) => {
        const details = [...line.picks, ...(line.note ? [`obs.: ${line.note}`] : [])];
        out.push(`${line.qty}x ${line.product.name}${details.length ? ` (${details.join(", ")})` : ""} · ${money((line.product.price + line.extra) * line.qty)}`);
      });
      out.push("", `Subtotal: ${money(subtotal())}`);
      if (current === "entrega") {
        const area = data.areas?.[Number(value("area"))];
        out.push(`Entrega: ${area?.name ?? ""} (${money(shippingFee)})`);
      } else if (current === "retirada") {
        out.push("Retirada no local");
      } else if (current === "envio") {
        out.push(`Frete: ${shippingFee === 0 ? "grátis" : money(shippingFee)}`);
      }
      out.push(`*Total: ${money(subtotal() + shippingFee)}*`, "");
      if (value("name")) out.push(`Nome: ${value("name")}`);
      if (value("size")) out.push(`Tamanho: ${value("size")}`);
      if (value("address")) out.push(`Endereço: ${value("address")}`);
      if (value("cep")) out.push(`CEP: ${value("cep")}`);
      if (value("payment")) out.push(`Pagamento: ${value("payment")}`);
      if (value("payment") === "Dinheiro" && value("change")) out.push(`Troco para: ${value("change")}`);
      if (value("note")) out.push(`Obs.: ${value("note")}`);
      const message = out.join("\n");
      const review = bag?.querySelector<HTMLElement>("[data-review]");
      const reviewText = review?.querySelector<HTMLElement>("[data-review-text]");
      const send = review?.querySelector<HTMLAnchorElement>("[data-review-send]");
      if (!review || !reviewText || !send) {
        openTalk(buildTalkLink(data.whatsapp, data.email, data.subject, message));
        return;
      }
      reviewText.textContent = message;
      send.href = /^\d{12,13}$/.test(data.whatsapp)
        ? `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
      checkout.hidden = true;
      review.hidden = false;
      review.scrollIntoView({ block: "start" });
    });
  }
  render();
}

function wireCategoryTabs(): void {
  document.querySelectorAll<HTMLElement>("[data-cat-tabs]").forEach((bar) => {
    const tabs = [...bar.querySelectorAll<HTMLButtonElement>("[data-cat-tab]")];
    const sections = [...document.querySelectorAll<HTMLElement>("[data-cat]")];
    const show = (category: string) => {
      tabs.forEach((tab) => tab.setAttribute("aria-pressed", String(tab.dataset.catTab === category)));
      sections.forEach((section) => {
        section.hidden = category !== "todos" && section.dataset.cat !== category;
      });
    };
    tabs.forEach((tab) => tab.addEventListener("click", () => show(tab.dataset.catTab ?? "todos")));
    const first = tabs[0]?.dataset.catTab;
    if (first) show(first);
  });
}

function wireSwitches(): void {
  document.querySelectorAll<HTMLElement>("[data-switch-group]").forEach((group) => {
    const param = group.dataset.param ?? "opcao";
    const buttons = [...group.querySelectorAll<HTMLButtonElement>("[data-switch]")];
    const panels = [...document.querySelectorAll<HTMLElement>("[data-switch-panel]")];
    const show = (value: string, updateUrl: boolean) => {
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.switch === value)));
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.switchPanel !== value;
      });
      group.style.setProperty("--switch-index", String(Math.max(0, buttons.findIndex((button) => button.dataset.switch === value))));
      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set(param, value);
        window.history.replaceState(null, "", url);
      }
    };
    buttons.forEach((button) => button.addEventListener("click", () => show(button.dataset.switch ?? "", true)));
    const fromUrl = new URLSearchParams(window.location.search).get(param);
    const initial = buttons.some((button) => button.dataset.switch === fromUrl) ? fromUrl : buttons[0]?.dataset.switch;
    if (initial) show(initial, false);
  });
}

function wireHours(): void {
  document.querySelectorAll<HTMLElement>("[data-hours]").forEach((badge) => {
    const opens = Number(badge.dataset.open ?? 0);
    const closes = Number(badge.dataset.close ?? 24);
    const days = (badge.dataset.days ?? "0,1,2,3,4,5,6").split(",").map(Number);
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((part) => part.type === "weekday")?.value ?? "");
    const hour = Number(parts.find((part) => part.type === "hour")?.value ?? -1);
    const open = days.includes(day) && hour >= opens && hour < closes;
    badge.classList.toggle("is-open", open);
    badge.textContent = open ? (badge.dataset.openText ?? "Aberto agora") : (badge.dataset.closedText ?? "Fechado agora");
  });
}

function wireTracking(): void {
  const form = document.querySelector<HTMLFormElement>("form[data-track]");
  const result = document.querySelector<HTMLElement>("[data-track-result]");
  if (!form || !result) return;
  const steps = [...result.querySelectorAll<HTMLElement>("[data-track-step]")];
  const code = result.querySelector<HTMLElement>("[data-track-code]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (form.querySelector<HTMLInputElement>("input")?.value ?? "").trim().toUpperCase();
    if (!value) return;
    const done = ([...value].reduce((sum, char) => sum + char.charCodeAt(0), 0) % steps.length) + 1;
    steps.forEach((step, index) => step.classList.toggle("is-done", index < done));
    if (code) code.textContent = value;
    result.hidden = false;
  });
}

function wireDialogButtons(): void {
  document.querySelectorAll<HTMLElement>("[data-open-dialog]").forEach((button) => {
    const dialog = document.getElementById(button.dataset.openDialog ?? "");
    if (!(dialog instanceof HTMLDialogElement)) return;
    wireDialogClosing(dialog);
    button.addEventListener("click", () => openDialog(dialog));
  });
}

const data = readData();
if (data) startStore(data);
wireTilt();
wireCompare();
wireCategoryTabs();
wireSwitches();
wireHours();
wireTracking();
wireDialogButtons();
