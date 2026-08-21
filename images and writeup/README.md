# TRGlobal Project Writeup
I spent a lot of time working on this project. Below is a writeup on some of the decisions I made in regarding the structure and implementation of this platform.

---

## Prisma Transaction Handling for `createOrder()`

It was very important to have everything related to the creation of an order within a Prisma transaction so to avoid the possibility of partial completion of order creation. 

I decided to utilise an interactive prisma transaction (`$transaction(async (tx) => ...)`) as opposed to the standard array form. I decided this because the array form just runs through a fixed list of queries, whereas checkout function requires branching in special cases (i.e. checking how much stock is available and whether it's enough or not). As mentioned above, every query runs through `tx` rather than the outer client so that either everything passes or nothing does.

The sequence can be outlined as such: read the cart with its items and their products -> validate stock across all lines -> create the order with its snapshot line items -> decrement stock -> clear the cart.

I included the cart read within the transaction so that validation only occurs against the same data that is acted on.

One thing that was noteworthy was how i decided to handle the verification and subsequent update of whether there are enough items in stock to properly handle the items requested followed by decreasing the stock on a successful order. A more naive approach would be to read the `product.stock`, compare it against the requested quantity and then issue a decrement to the stock. The issue with this is that there is a gap between the read and write. This introduces a race condition. If you had two users both attempting to order an item with `stock = 3` then it's entirely possible for both to read the stock as being sufficient and subsequently both decrementing, resulting in a stock of `-3` and an order incapable of being fulfilled.

### My Solution:
```Prisma Query
where: { id: productId, stock: { gte: quantity } }
data: { stock: { decrement: quantity } }
```
This returns a single SQL query of `UPDATE products SET stock = stock - n WHERE id = ... AND stock >= n`. Meaning that the database handles the write and read atomically under a row lock.

---

## Decisions Left To Me

The outline for this project described multiple decisions that were up to me to reach a conclusion on. They are listed below along with my rationale for each.

- **Category relation:** One-to-many vs many-to-many
- **Category deletion:** Behavior when products exist
- **Order status flow:** How many states, and who can transition them
- **Pagination style:** Offset vs cursor
- **Product images:** How are they handled, url or upload system

### Category Relation:
Decided to go with one category to many products. The implementation of many-to-many would result add a join table and ambiguity that would be of no use for a project of this scale.

### Category Deletion:
It is forbidden to delete a category that has products within it (throws a `409`). The products must be assigned to another category or removed prior to the deletion of the category. It makes a lot more sense intrinsically to have the possibility of a category without products than products without a category. If anything this would require a catch-all category of uncategorised products. 

### Order Status Flow:
The order status is as follows: PENDING -> SHIPPED or CANCELLED. This is controlled entirely by ADMIN users. I decided that it would be beneficial to make this dependent on the admin while allowing users to make requests to cancel their orders seeing as it may be the case that the order is at a status where it might not be possible to cancel. With this implementation, vetting can be done by administrators.

### Pagination Style:
I utilised offset pagination that returns `{ items, total, skip, take, hasMore }`. This was my first attempt at implementing pagination of any sort, so I decided it would be beneficial to learn the more basic method before exploring cursor based pagination. Additionally, for the scale of data that exists within this project, cursor pagination would have felt like overkill where offset is more than capable.

### Product Images:
Utilised simple image URLs for ease in the generation with the prisma seed. However, on the frontend, I have a placeholder image saved in the event that a product exists with a null imageUrl. For the scale of this project and the implementation required for testing with no real stock, simple URLs seemed like the most straightforward and time efficient approach. I am open to changing this in the future with further admin functionality implementation.
