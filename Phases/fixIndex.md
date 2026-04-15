You are a senior frontend + full-stack engineer specialized in Nuxt 3, Vue 3, and production-grade applications.

Your task is to FIX and REFACTOR the following admin products page to eliminate bugs, improve stability, and align it with best practices.

DO NOT explain — directly APPLY code fixes.

---

# 🚨 Known Issues To Fix

## 1. API Response Structure Mismatch

The API returns:

```ts
{ success: true, items: Product[] }
```

But the frontend incorrectly assumes:

```ts
products.value // array ❌
```

👉 FIX:

* Always extract:

```ts
const items = products.value?.items || []
```

* Update ALL computed logic accordingly

---

## 2. Broken Filtering Logic

Fix `filteredProducts` so it:

* Works with API response structure
* Safely handles undefined values
* Does NOT mutate original data

---

## 3. useApiFetch Key Issue

Currently:

```ts
useApiFetch('/api/admin/products')
```

👉 FIX:

* Add stable key:

```ts
key: 'admin-products'
```

* Also fix categories:

```ts
key: 'admin-categories'
```

---

## 4. Query Reactivity Issue

`computed query` is unreliable.

👉 FIX:

* Remove reactive query dependency
* Add:

```ts
watch(showArchived, () => refreshProducts())
```

---

## 5. Vue Safety Fixes

Fix all unsafe usages:

### categories loop

```vue
v-for="cat in categories || []"
```

### product stock

```ts
(product.stock ?? 0)
```

### optional chaining everywhere needed

---

## 6. Error Handling (CRITICAL)

Replace all:

```ts
catch (err) {
  toast.error(err.data?.statusMessage)
}
```

With:

```ts
catch (err: any) {
  toast.error(err?.data?.statusMessage || err?.message || 'Something went wrong')
}
```

---

## 7. File Input Type Fix

Replace:

```ts
const fileInput = ref(null)
```

With:

```ts
const fileInput = ref<HTMLInputElement | null>(null)
```

---

## 8. Image Upload (IMPORTANT)

Currently uses base64 ❌

👉 DO NOT implement full upload system,
BUT prepare structure:

* Keep previews for UI
* Store files temporarily (not base64 strings)
* Add TODO comment for API upload

---

## 9. Remove Redundant Refresh

Fix:

```ts
triggerRefresh('products')
await refreshProducts()
```

👉 Keep ONLY one (prefer refreshProducts)

---

## 10. Discount Field Fix

Replace:

```ts
discount: null
```

With:

```ts
discount: 0
```

---

## 11. Improve UX (Hover Issue)

Fix action buttons visibility:

Replace:

```html
opacity-0 group-hover:opacity-100
```

With:

```html
opacity-100 md:opacity-0 md:group-hover:opacity-100
```

---

## 12. Defensive Programming

Ensure:

* products.value always safe
* categories.value always safe
* no runtime crashes if API fails

---

# 🎯 Expected Output

Return:

1. FULL updated `<script setup>` section
2. Only the modified template parts (not full template)
3. Clean, production-ready code

---

# ⚠️ Rules

* Do NOT remove features
* Do NOT break UI
* Do NOT explain — only code
* Follow Nuxt 3 best practices
* Code must be clean and scalable

---

Now refactor the code completely.
