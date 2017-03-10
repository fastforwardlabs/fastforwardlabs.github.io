import random
from itertools import cycle, islice, repeat
import tqdm
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
sns.set_context('talk')

cola = "#7a4ab5"
colb = "#00c370"
n_a = 500
obs_a = 20
n_b = 400
obs_b = 20
bins = 50
nsamples = 100000


def abayes(data, prior_sampler, simulate, compare):
    '''Yield samples from the posterior by Approximate Bayesian Computation.'''
    for p in prior_sampler:
        if compare(simulate(p), data):
            yield p


def normal_constrained_support_prior_sampler(mu=0.035, sigma=0.01):
    '''
    Yield stream of samples from normal distribution in interval (0, 1).
    '''
    while True:
        x = np.random.normal(mu, sigma)
        if 0 <= x <= 1:
            yield x


def uniform_prior_sampler(x1=0, x2=0.2):
    '''Yield stream of random numbers in interval (x1, x2).'''
    while True:
        x = random.random()
        if x1 <= x <= x2:
            yield x


def compare_conversion(obs1, obs2):
    '''Return true if two observations are the same.'''
    return obs1 == obs2


def simulate_conversion(p, n_visitors=n_b):
    '''Returns number of vistors who convert given conversion fraction p.'''
    return sum(random.random() < p for _ in range(n_visitors))


posterior_sampler_a = abayes(obs_a,
                             normal_constrained_support_prior_sampler(),
                             lambda p: simulate_conversion(p, n_visitors=n_a),
                             compare_conversion)

posterior_sampler_b = abayes(obs_b,
                             uniform_prior_sampler(),
                             lambda p: simulate_conversion(p, n_visitors=n_b),
                             compare_conversion)


def three_samples_a():
    print(list(islice(posterior_sampler_a, 3)))


def three_samples_b():
    print(list(islice(posterior_sampler_b, 3)))


def tqdm_sample(sampler, nsamples=nsamples):
    samples = []
    for i in tqdm.trange(nsamples):
        samples.append(next(sampler))
    return samples


def make_sampler_from_samples(samples):
    samples = list(samples)
    np.random.shuffle(samples)
    return cycle(samples)


def fig_abayes_posterior():
    samples = tqdm_sample(posterior_sampler_b, nsamples=500)
    fig, ax = plt.subplots(figsize=(4, 3))
    ax.hist(samples, normed=True, color=colb)
    fig.tight_layout()
    fig.savefig('img/abayes_posterior.png', bbox_inches='tight')


def get_layout_samples(layout='a'):
    if layout == 'a':
        prior_sampler = normal_constrained_support_prior_sampler()
        posterior_sampler = posterior_sampler_a
    else:
        prior_sampler = uniform_prior_sampler()
        posterior_sampler = posterior_sampler_b
    # 10*  to make prior appear smooth
    prior = tqdm_sample(prior_sampler, nsamples=10*nsamples)
    posterior = tqdm_sample(posterior_sampler)
    return prior, posterior


def fig_layout(prior, posterior, layout='a'):
    if layout == 'a':
        col = cola
    else:
        col = colb
    fig, ax = plt.subplots(1, 2, sharex=True, sharey=True, figsize=(11, 5))
    fig.tight_layout()
    lim1, lim2 = 0, 0.10
    ax[0].hist([p for p in prior if lim1 < p < lim2],
               bins=bins, normed=True, color=col)
    ax[0].set_title("Prior " + layout.upper())
    ax[0].axes.get_yaxis().set_ticks([])
    ax[1].hist(posterior, bins=bins, normed=True, color=col)
    ax[1].set_title("Posterior " + layout.upper())
    ax[1].set_xlim(lim1, lim2)
    ax[0].set_xlabel("Conversion fraction")
    ax[0].set_ylabel("Probability")
    ax[1].set_xlabel("Conversion fraction")
    fig.savefig('img/layout{}.png'.format(layout))


def fig_compareposteriors(posterior_a, posterior_b):
    pbbetter = (np.array(posterior_b) > np.array(posterior_a)).mean()
    agtb = [i for i, (a, b) in enumerate(zip(posterior_a, posterior_b))
            if a > b]
    bgta = [i for i, (a, b) in enumerate(zip(posterior_a, posterior_b))
            if b > a]

    fig, ax = plt.subplots(figsize=(6.5, 6.5))
    ax = sns.regplot(np.array(posterior_a)[agtb], np.array(posterior_b)[agtb],
                     fit_reg=False, color=cola, marker='.')
    ax = sns.regplot(np.array(posterior_a)[bgta], np.array(posterior_b)[bgta],
                     fit_reg=False, color=colb, marker='.')

    lim1, lim2 = 0, 0.12
    ax.set_xlim(lim1, lim2)
    ax.set_ylim(lim1, lim2)
    ax.plot([lim1, lim2], [lim1, lim2], color=colb)
    ax.text(0.07, 0.10, 'B better', color=colb)
    ax.text(0.07, 0.095, '{:.1f}%'.format(100*pbbetter), color=colb)
    ax.text(0.09, 0.07, 'A better', color=cola)
    ax.text(0.09, 0.065, '{:.1f}%'.format(100-100*pbbetter), color=cola)
    ax.set_xlabel('Conversion fraction layout A')
    ax.set_ylabel('Conversion fraction layout B')
    fig.savefig('img/compareposteriors.png', bbox_inches='tight')


def fig_online():
    n = 80
    obses = repeat(4)  # 5%

    fig, ax = plt.subplots(1, 5, figsize=(11, 2.5), sharey=True)

    p = []
    prior_sampler = uniform_prior_sampler()

    for i, (obs, a) in enumerate(zip(obses, ax)):
        n_cum = (i+1) * n
        print(n_cum)
        posterior_sampler = abayes(
            obs,
            prior_sampler,
            lambda p: simulate_conversion(p, n_visitors=n),
            compare_conversion
        )
        posterior = tqdm_sample(posterior_sampler, nsamples=100000)
        p.append(posterior)
        prior_sampler = make_sampler_from_samples(posterior)
        a.hist(p[-1], normed=True, bins=bins, color=colb)
        a.axes.get_yaxis().set_ticks([])
        a.axes.get_xaxis().set_ticks([0, 0.1, 0.2])
        a.set_title(str(n_cum))  # + ' visitors')
        a.set_xlim(0, 0.2)
        fig.tight_layout()
        fig.savefig('img/online.png', bbox_inches='tight')


def main():
    fig_abayes_posterior()
    print('Sampling from Layout A')
    prior_a, posterior_a = get_layout_samples(layout='a')
    fig_layout(prior_a, posterior_a, layout='a')
    print('Sampling from Layout B')
    prior_b, posterior_b = get_layout_samples(layout='b')
    fig_layout(prior_b, posterior_b, layout='b')
    fig_compareposteriors(posterior_a, posterior_b)
    fig_online()


if __name__ == '__main__':
    main()
