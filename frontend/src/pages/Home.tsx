export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-pink-500/20 blur-3xl"></div>

        <div className="relative z-10 max-w-4xl">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
            🚀 Fastest Food Delivery App
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight md:text-7xl">
            Delicious Food,
            <br />
            Delivered <span className="text-orange-400">Fast.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            Order from your favorite restaurants with lightning-fast delivery,
            real-time tracking, and exclusive offers.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-semibold transition hover:scale-105 hover:bg-orange-600">
              Order Now
            </button>

            <button className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-white/20">
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">Popular Categories</h2>
            <p className="mt-4 text-gray-400">
              Choose your favorite food category
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { name: "Pizza", emoji: "🍕" },
              { name: "Burger", emoji: "🍔" },
              { name: "Sushi", emoji: "🍣" },
              { name: "Dessert", emoji: "🍰" },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md transition hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="text-5xl">{item.emoji}</div>
                <h3 className="mt-4 text-xl font-semibold">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">Featured Restaurants</h2>
            <p className="mt-4 text-gray-400">
              Top-rated restaurants near you
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="h-52 bg-gradient-to-r from-orange-400 to-red-500"></div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Food Palace</h3>
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                      ⭐ 4.8
                    </span>
                  </div>

                  <p className="mt-3 text-gray-400">
                    Burgers • Pizza • Drinks
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-orange-400">30 mins</span>

                    <button className="rounded-xl bg-orange-500 px-5 py-2 font-medium transition hover:bg-orange-600">
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-gradient-to-r from-orange-500 to-red-500 p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold md:text-5xl">
            Ready to order your favorite meal?
          </h2>

          <p className="mt-6 text-lg text-white/80">
            Get exclusive discounts and lightning-fast delivery.
          </p>

          <button className="mt-10 rounded-2xl bg-white px-10 py-4 text-lg font-bold text-black transition hover:scale-105">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
