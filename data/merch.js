/*
  ====================================================================
  MERCH CATALOGUE
  data/merch.js

  THIS IS THE ONLY FILE YOU EDIT TO ADD, CHANGE OR REMOVE MERCH.

  Photos go in assets/merch/<id>/ numbered 01.jpg, 02.jpg, ...

  FIELDS:
    id           "bleach-tee"   required. Lowercase, dashes, no spaces.
                                Also the photo folder name.
    name         "Bleach Tee"   required.
    price        35             required. Numbers only, no symbol.
    description  "..."          optional. One or two lines.
    photos       2              how many numbered photos exist.
                                0 shows a placeholder tile.
    variants     [ ... ]        optional. Sizes or versions, each with
                                its own stock:
                                  [{ label: "M", stock: 2 }]
                                Leave it out for items with no options
                                (CDs, stickers, posters).
    stock        12             used ONLY when there are no variants.
                                0 = sold out.
    active       true           false hides it without deleting it.

  STOCK IS NOT AUTOMATIC. After you fulfil an order, lower the number
  here yourself.

  An empty list shows COMING SOON in place of the grid.

  Lines starting with // are comments; the browser ignores them.
  ====================================================================
*/

window.SITE_MERCH = [

  // ---- paste new items above this line ----
];
