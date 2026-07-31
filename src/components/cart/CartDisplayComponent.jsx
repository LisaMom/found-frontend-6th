import { useAppDispatch, useAppSelector } from "../../lib/hook"
import { removeFromCart } from "../../features/cart/CartSlice"

export default function CartDisplayComponent() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const totalItems = useAppSelector((state) => state.cart.totalItems);
  const totalPrice = useAppSelector((state) => state.cart.totalPrice);

  return (
    <section className=" w-full h-[700px] relative bg-white dark:bg-[#0A2025] ">
      <div className="bg-white flex flex-col h-full absolute right-0 p-10 w-[450px]">

        {/* Shopping Cart Header */}
        <div className="flex items-center mb-3 justify-between ">
          <h2 className="text-[#191919] text-xl font-medium leading-[30px]">
            Shopping Cart ({totalItems})
          </h2>
          <svg width={45} height={45} viewBox="0 0 45 45" fill="none" xmlns="http://w3.org" >
            <circle cx="22.5" cy="22.5" r="22.5" fill="white" />
            <path d="M28.75 16.25L16.25 28.75" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.25 16.25L28.75 28.75" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Real cart items */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-sm text-[#7f7f7f]">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div key={item.uuid} className="flex gap-2 items-center">
              <img
                width={80}
                height={70}
                src={item.thumbnail}
                alt={item.name}
                className="object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-[#191919] text-sm font-normal leading-[21px]">
                  {item.name}
                </h3>
                <p>
                  <span className="text-[#7f7f7f] text-sm font-normal leading-[21px]">
                    {item.quantity} x
                  </span>
                  <span className="text-[#191919] text-sm font-semibold leading-[16.80px]">
                    {" "}${item.price}
                  </span>
                </p>
              </div>
              <svg
                onClick={() => dispatch(removeFromCart(item.uuid))}
                className="cursor-pointer"
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
              >
                <g clipPath="url(#clip0_629_6652)">
                  <path d="M12 23C18.0748 23 23 18.0748 23 12C23 5.92525 18.0748 1 12 1C5.92525 1 1 5.92525 1 12C1 18.0748 5.92525 23 12 23Z" stroke="#CCCCCC" strokeMiterlimit={10} />
                  <path d="M16 8L8 16" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" ></path>
                  <path d="M16 16L8 8" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" ></path>
                </g>
                <defs>
                  <clipPath id="clip0_629_6652">
                    <rect width={24} height={24} fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ))}
        </div>


        {/* Bottom Checkout Info */}
        <div className="mt-auto">
          <div className=" py-6 bg-white flex justify-between items-center">
            <span className="text-[#191919] text-base font-normal leading-normal">
              {totalItems} Product{totalItems === 1 ? "" : "s"}
            </span>
            <span className="text-[#191919] text-base font-semibold leading-tight">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <button className="w-full px-10 py-4 bg-[#00b206] rounded-[43px] text-white text-base font-semibold leading-tight">
            Checkout
          </button>
          <button className="w-full mt-3 px-10 py-4 bg-[#56ac59]/10 rounded-[43px] text-[#00b206] text-base font-semibold leading-tight">
            Go To Cart
          </button>
        </div>

      </div>
    </section>
  )
}
