# Drawing the set — ideas that differ, a hundred that stay different, and reading back what was drawn

A count of a hundred is a promise about variety, not about file count. This file is how that promise is kept, and how the result is checked.

The agent composes every picture itself. There is no catalogue to pull from and no service to ask, so the variety has to be decided rather than hoped for: a hundred pictures made without a plan are one picture made a hundred times, whoever is drawing.

## From a reference to ideas

An idea is a way of picturing the subject, not a wording. The test for whether two ideas are two: describe each in a short sentence with no adjectives. If the sentences differ only in adjectives, it is one idea twice.

Ideas come from asking what *kind* of picture the subject can be, and the kinds are genuinely different from each other:

- **The thing itself**, drawn as it is.
- **The thing in use**, with the hands, the desk, the screen, the room around it.
- **The consequence**, the state the subject produces rather than the subject.
- **The comparison**, the before and the after in one frame.
- **The metaphor**, one physical object that behaves the way the subject behaves.
- **The detail**, one part at close range, standing for the whole.
- **The abstraction**, the shape or the pattern the subject makes when the literal is dropped.
- **The scene without the subject**, the place it belongs to, recognisable by its absence.

A set of ten wants ideas from at least four of those. A set of a hundred wants all of them and several readings of each, because a hundred variations on one kind is one picture printed a hundred times.

## Composing one picture

Each picture is written out as markup the agent produces on the spot — vector shapes, type, fields of colour — and rasterised to a PNG at the ratio the run agreed. Four things decide it and nothing else matters:

1. **The subject**, concrete.
2. **The idea**, which of the kinds above this one is.
3. **The register**, read off the material rather than chosen for taste.
4. **The frame**, the ratio and what fills it.

What never reaches a picture: numbers, logos, product names, real people and any claim the material does not support. A convincing chart is easy to draw and impossible to justify afterwards, and a picture that claims something the source never said is a fabrication with a frame around it.

**Vary the axis that shows, not the one that does not.** At the size a post is read, what separates two pictures is the kind of picture, where the subject sits, the light and the palette. A restyle, a colour swapped for its neighbour, a border added — those produce two files and one picture. Spend the count on the axes a viewer can see.

**What this medium can and cannot do.** Composed markup gives flat and graphic work: shape, type, colour, diagram, pattern, silhouette, texture built from primitives. It does not give photography, and a run that promises a photographic set through this route is promising something it cannot draw. Where the material wants a photograph, say so and let the user supply one — `awesome-content-image-adapter` will fit whatever they bring to every platform.

**Text inside the picture is a liability.** A headline with a wrong letter is worse than no headline. Where a set carries words, read them back off the rendered file rather than off the markup: markup that says the right thing can still render wrong when a face is missing, a box is too small or a line clips.

## What a second round has to change

The user asking for another round is asking for a different set, not the same set shaken.

There is no randomness to turn here. Nothing varies on its own, so a second round is different exactly to the extent it is composed differently: a different selection of kinds, different placements, a different reading of the register, a different palette family. Decide those before drawing anything, and say in one line what moved between the rounds.

Reusing the first round's ideas with new colours is the first round again. So is keeping the compositions and changing the type.

Rounds do not overwrite each other. Each goes in its own folder, and the earlier ones stay, because a user who liked something in the first round may want it back after the third.

## Reading back what was drawn

Before the folder is opened, and again before anything is reported:

- **The count.** The folder holds what was asked for. Short is reported with the number.
- **Every file opens** and is an image at the ratio that was asked for. A file that failed to rasterise is a finding, not a detail.
- **The set is a set.** Look at the folder as a grid, the way the user will. Two images that read as the same picture at that size are one picture delivered twice; say how many such pairs there are rather than letting the count imply variety it does not have.
- **The text, read letter by letter** off the rendered file wherever a picture carries any.
- **The claims.** No number, logo, named product or recognisable person that the material does not support.
- **The subject survived.** Cover the caption and ask whether the subject is still recognisable. A set that needs its caption to make sense is a set of decorations.

A finding here is named with the file it is in. "Some of them look similar" is not a finding; "004 and 037 are the same composition" is.
